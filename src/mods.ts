import type { PlayerPokemon, PokemonMove } from "#app/field/pokemon";
import type Pokemon from "#app/field/pokemon";
import type BattleScene from "#app/battle-scene";
import { starterColors } from "#app/battle-scene";
import type { LevelMoves } from "#app/data/pokemon-level-moves";
import { Moves } from "#enums/moves";
import { speciesEggMoves } from "#app/data/balance/egg-moves";
import type PokemonSpecies from "#app/data/pokemon-species";
import { getPokemonSpecies } from "#app/data/pokemon-species";
import { speciesStarterCosts } from "#app/data/balance/starters";
import { SpeciesFormKey } from "#enums/species-form-key";
import { achvs } from "#app/system/achv";
import type StarterSelectUiHandler from "#app/ui/starter-select-ui-handler";
import i18next from "i18next";
import type UI from "#app/ui/ui";
import { Mode } from "#app/ui/ui";
import { allMoves } from "#app/data/move";
import { AbilityAttr, DexAttr } from "#app/system/game-data";
import { allAbilities } from "#app/data/ability";
import { getNatureName } from "#app/data/nature";
import { Nature } from "#enums/nature";
import * as Utils from "./utils";
import { pokemonFormChanges, SpeciesFormChangeItemTrigger } from "#app/data/pokemon-forms";
import { Species } from "#enums/species";
import { WeatherType } from "#enums/weather-type";
import { TerrainType } from "#app/data/terrain";
import type {
  ModifierType,
  ModifierTypeOption,
  SpeciesStatBoosterItem } from "#app/modifier/modifier-type";
import {
  AllPokemonLevelIncrementModifierType,
  AttackTypeBoosterModifierType,
  BerryModifierType,
  DoubleBattleChanceBoosterModifierType,
  EvolutionItemModifierType,
  ExpBoosterModifierType,
  FormChangeItemModifierType,
  FusePokemonModifierType,
  modifierTypes,
  MoneyRewardModifierType,
  PokemonAllMovePpRestoreModifierType,
  BaseStatBoosterModifierType,
  PokemonExpBoosterModifierType,
  PokemonHeldItemModifierType,
  PokemonHpRestoreModifierType,
  PokemonLevelIncrementModifierType,
  PokemonModifierType,
  PokemonMoveModifierType,
  PokemonNatureChangeModifierType,
  PokemonPpRestoreModifierType,
  PokemonPpUpModifierType,
  PokemonReviveModifierType,
  PokemonStatusHealModifierType,
  RememberMoveModifierType,
  SpeciesStatBoosterModifierType,
  TempStatStageBoosterModifierType,
  TerastallizeModifierType,
  TmModifierType
} from "#app/modifier/modifier-type";
import { pokemonEvolutions } from "#app/data/balance/pokemon-evolutions";
import * as Modifiers from "#app/modifier/modifier";
import { Type } from "#enums/type";
import { BerryType } from "#enums/berry-type";
import type { TempBattleStat } from "#app/data/temp-battle-stat";
import { PartyOption, PartyUiMode } from "#app/ui/party-ui-handler";
import { BattleType } from "#app/battle";
import { EncounterPhase } from "#app/phases/encounter-phase";
import { SummonPhase } from "#app/phases/summon-phase";
import { CheckSwitchPhase } from "#app/phases/check-switch-phase";

export class Mods {

  //SETTINGS
  public infiniteBalls: boolean = false;

  public hiddenAbilityModifier: number = 1;
  public shinyModifier: number = 1;

  public catchTrainerPokemon: boolean = false;
  public catchTrainerPokemonRestrictions: boolean = true;

  public infiniteVouchers: boolean = false;

  public overrideEggHatchWaves: boolean = false;

  public overrideEggRarityIndex: number = 1;

  public eggSpeciesPitty: number = 9;

  public candyCostMultiplier: number = 1;

  public regenPokeChance: number = 0;

  /**
   * Adds egg moves to learnable moves
   */
  getLearnableMoves(scene: BattleScene, species: PokemonSpecies, fusionSpecies: PokemonSpecies, moveset: PokemonMove[], levelMoves: LevelMoves): Moves[] {

    const learnableMoves = levelMoves
      .map((lm) => lm[1])
      .filter((lm) => !moveset.filter(m => m.moveId === lm).length)
      .filter((move: Moves, i: integer, array: Moves[]) => array.indexOf(move) === i);

    const isFusionSpecies = fusionSpecies ? 1 : 0;

    for (let speciesIndex = 0; speciesIndex <= isFusionSpecies; speciesIndex++) {
      const speciesId = speciesIndex < 1 ? species.getRootSpeciesId() : fusionSpecies.getRootSpeciesId();
      for (let moveIndex = 0; moveIndex < 4; moveIndex++) {
        if (
          scene.gameData.starterData[speciesId].eggMoves & Math.pow(2, moveIndex) &&
          moveset.filter((m) => m.moveId !== speciesEggMoves[species.getRootSpeciesId()][moveIndex]).length === moveset.length
        ) {
          learnableMoves[learnableMoves.length] = speciesEggMoves[speciesId][moveIndex];
        }
      }
    }
    return learnableMoves;
  }

  /**
   * Skips a lot of the animations when hatching eggs to speed it up.
   */
  fastHatchAnimation(scene: BattleScene, pokemon: PlayerPokemon, eggMoveIndex: integer, eggContainer: Phaser.GameObjects.Container,
    pokemonSprite: Phaser.GameObjects.Sprite, pokemonShinySparkle: Phaser.GameObjects.Sprite): Promise<void> {

    const isShiny = pokemon.isShiny();
    if (pokemon.species.subLegendary) {
      scene.validateAchv(achvs.HATCH_SUB_LEGENDARY);
    }
    if (pokemon.species.legendary) {
      scene.validateAchv(achvs.HATCH_LEGENDARY);
    }
    if (pokemon.species.mythical) {
      scene.validateAchv(achvs.HATCH_MYTHICAL);
    }
    if (isShiny) {
      scene.validateAchv(achvs.HATCH_SHINY);
    }

    return new Promise((resolve) => {
      this.revealHatchSprite(scene, pokemon, eggContainer, pokemonSprite, pokemonShinySparkle);
      scene.ui.showText(
        `A ${pokemon.name} hatched!`,
        null,
        () => {
          scene.gameData.updateSpeciesDexIvs(pokemon.species.speciesId, pokemon.ivs);
          scene.gameData.setPokemonCaught(pokemon, true, true).then(() => {
            scene.gameData
              .setEggMoveUnlocked(pokemon.species, eggMoveIndex)
              .then(() => {
                scene.ui.showText(null, 0);
              })
              .then(() => resolve());
          });
        },
        null,
        true,
        null
      );
    });
  }

  private revealHatchSprite(
    scene: BattleScene,
    pokemon: PlayerPokemon,
    eggContainer: Phaser.GameObjects.Container,
    pokemonSprite: Phaser.GameObjects.Sprite,
    pokemonShinySparkle: Phaser.GameObjects.Sprite
  ) {
    pokemon.cry();

    eggContainer.setVisible(false);
    pokemonSprite.play(pokemon.getSpriteKey(true));
    pokemonSprite.setPipelineData("ignoreTimeTint", true);
    pokemonSprite.setPipelineData("spriteKey", pokemon.getSpriteKey());
    pokemonSprite.setPipelineData("shiny", pokemon.shiny);
    pokemonSprite.setPipelineData("variant", pokemon.variant);
    pokemonSprite.setVisible(true);

    if (pokemon.isShiny()) {
      pokemonShinySparkle.play(`sparkle${pokemon.variant ? `_${pokemon.variant + 1}` : ""}`);
      scene.playSound("sparkle");
    }
  }

  /**
   * Egg moves candy unlock store
   */
  showEggMovesUnlock(
    scene: BattleScene,
    ui: UI,
    lastSpecies: PokemonSpecies,
    candyCount: any,
    uiHandler: StarterSelectUiHandler,
    pokemonCandyCountText: Phaser.GameObjects.Text
  ) {
    const options = [];

    for (let index = 0; index < 4; index++) {
      const eggMoveUnlocked = scene.gameData.starterData[lastSpecies.speciesId].eggMoves & Math.pow(2, index);
      if (!eggMoveUnlocked) {
        options.push({
          label: `x${this.unlockEggMovePrice(index, lastSpecies)} Unlock ${this.getEggMoveName(lastSpecies, index)}`,
          handler: () => {
            if (candyCount >= this.unlockEggMovePrice(index, lastSpecies)) {
              this.unlockEggMove(scene, ui, lastSpecies, uiHandler, pokemonCandyCountText, index);
            }
            return false;
          },
          item: "candy",
          itemArgs: starterColors[lastSpecies.speciesId],
        });
      }
    }

    options.push({
      label: i18next.t("menu:cancel"),
      handler: () => {
        ui.setMode(Mode.STARTER_SELECT);
        return true;
      },
    });
    ui.setModeWithoutClear(Mode.OPTION_SELECT, {
      options: options,
      yOffset: 47,
    });
  }

  protected unlockEggMove(
    scene: BattleScene,
    ui: UI,
    lastSpecies: PokemonSpecies,
    uiHandler: StarterSelectUiHandler,
    pokemonCandyCountText: Phaser.GameObjects.Text,
    index: integer
  ) {
    scene.gameData.setEggMoveUnlocked(lastSpecies, index);
    scene.gameData.starterData[lastSpecies.speciesId].candyCount -= this.unlockEggMovePrice(index, lastSpecies);

    pokemonCandyCountText.setText(`x${scene.gameData.starterData[lastSpecies.speciesId].candyCount}`);
    uiHandler.setSpeciesDetails(lastSpecies, undefined, undefined, undefined, undefined, undefined, undefined);

    scene.gameData.saveSystem().then((success) => {
      if (!success) {
        return scene.reset(true);
      }
    });
    ui.setMode(Mode.STARTER_SELECT);
    return true;
  }

  protected unlockEggMovePrice(index: integer, species: PokemonSpecies): integer {
    const baseCost = speciesStarterCosts[species.speciesId] > 5 ? 3 : speciesStarterCosts[species.speciesId] > 3 ? 4 : 5;
    const rareMoveAddition = index > 2 ? 1 : 0;

    return Math.round((baseCost + rareMoveAddition) * this.candyCostMultiplier);
  }

  getEggMoveName(species: PokemonSpecies, index: integer) {
    const hasEggMoves = species && speciesEggMoves.hasOwnProperty(species.speciesId);
    const eggMove = hasEggMoves ? allMoves[speciesEggMoves[species.speciesId][index]] : null;
    return eggMove.name;
  }

  /**
   * Shiny unlock store
   */
  showShiniesUnlock(
    scene: BattleScene,
    ui: UI,
    lastSpecies: PokemonSpecies,
    candyCount: any,
    uiHandler: StarterSelectUiHandler,
    pokemonCandyCountText: Phaser.GameObjects.Text
  ) {
    const options = [];

    for (let rarity = 1; rarity < 4; rarity++) {
      const shinyVariant = this.getShinyRarity(rarity);
      if (!(scene.gameData.dexData[lastSpecies.speciesId].caughtAttr & shinyVariant)) {
        options.push({
          label: `x${this.unlockShinyPrice(rarity, lastSpecies)} Unlock ${this.getShinyRarityName(rarity)}`,
          handler: () => {
            if (candyCount >= this.unlockShinyPrice(rarity, lastSpecies)) {
              this.unlockShiny(scene, ui, lastSpecies, uiHandler, pokemonCandyCountText, rarity);
            }
            return false;
          },
          item: "candy",
          itemArgs: starterColors[lastSpecies.speciesId],
        });
      }
    }

    options.push({
      label: i18next.t("menu:cancel"),
      handler: () => {
        ui.setMode(Mode.STARTER_SELECT);
        return true;
      },
    });
    ui.setModeWithoutClear(Mode.OPTION_SELECT, {
      options: options,
      yOffset: 47,
    });
  }

  protected unlockShiny(
    scene: BattleScene,
    ui: UI,
    lastSpecies: PokemonSpecies,
    uiHandler: StarterSelectUiHandler,
    pokemonCandyCountText: Phaser.GameObjects.Text,
    rarity: integer
  ) {
    scene.gameData.starterData[lastSpecies.speciesId].candyCount -= this.unlockShinyPrice(rarity, lastSpecies);
    while (rarity > 0) {
      scene.gameData.dexData[lastSpecies.speciesId].caughtAttr |= this.getShinyRarity(rarity);
      rarity--;
    }
    pokemonCandyCountText.setText(`x${scene.gameData.starterData[lastSpecies.speciesId].candyCount}`);

    uiHandler.setSpecies(lastSpecies);
    uiHandler.updateInstructions();
    uiHandler.setSpeciesDetails(lastSpecies, undefined, undefined, undefined, undefined, undefined, undefined);

    scene.gameData.saveSystem().then((success) => {
      if (!success) {
        return scene.reset(true);
      }
    });
    ui.setMode(Mode.STARTER_SELECT);
    return true;
  }

  protected unlockShinyPrice(rarity: integer, species: PokemonSpecies): integer {
    const basePokemonValue = speciesStarterCosts[species.speciesId] > 3 ? speciesStarterCosts[species.speciesId] + 1 : speciesStarterCosts[species.speciesId];

    const baseCost = 50 - 5 * (basePokemonValue - 1);

    return Math.round(baseCost * ((1 + rarity) / 2)) * this.candyCostMultiplier;
  }

  protected getShinyRarity(rarity: integer): bigint {
    if (rarity === 3) {
      return DexAttr.VARIANT_3;
    }
    if (rarity === 2) {
      return DexAttr.VARIANT_2;
    }
    return DexAttr.SHINY;
  }

  protected getShinyRarityName(rarity: integer): String {
    if (rarity === 3) {
      return "epic shiny";
    }
    if (rarity === 2) {
      return "rare shiny";
    }
    return "common shiny";
  }

  /**
   * Ability unlock store
   */
  showAbilityUnlock(
    scene: BattleScene,
    ui: UI,
    lastSpecies: PokemonSpecies,
    candyCount: any,
    uiHandler: StarterSelectUiHandler,
    pokemonCandyCountText: Phaser.GameObjects.Text
  ) {
    const options = [];
    const abilityAttr = scene.gameData.starterData[lastSpecies.speciesId].abilityAttr;

    const allAbilityAttr = this.getAllAbilityAttr(lastSpecies);

    const unlockedAbilityAttr = [ abilityAttr & AbilityAttr.ABILITY_1, abilityAttr & AbilityAttr.ABILITY_2, abilityAttr & AbilityAttr.ABILITY_HIDDEN ].filter(
      (a) => a
    );
    const lockedAbilityAttr = allAbilityAttr.filter((item) => !unlockedAbilityAttr.includes(item));

    for (let abilityIndex = 0; abilityIndex < lastSpecies.getAbilityCount(); abilityIndex++) {
      if (!(abilityAttr & unlockedAbilityAttr[abilityIndex])) {
        const selectedAbility = lockedAbilityAttr.pop();
        options.push({
          label: `x${this.unlockAbilityPrice(selectedAbility, lastSpecies)} Unlock ${this.getAbilityName(selectedAbility, lastSpecies)}`,
          handler: () => {
            if (candyCount >= 0) {
              this.unlockAbility(scene, ui, lastSpecies, uiHandler, pokemonCandyCountText, selectedAbility);
            }
            return false;
          },
          item: "candy",
          itemArgs: starterColors[lastSpecies.speciesId],
        });
      }
    }

    options.push({
      label: i18next.t("menu:cancel"),
      handler: () => {
        ui.setMode(Mode.STARTER_SELECT);
        return true;
      },
    });
    ui.setModeWithoutClear(Mode.OPTION_SELECT, {
      options: options,
      yOffset: 47,
    });
  }

  protected unlockAbility(
    scene: BattleScene,
    ui: UI,
    lastSpecies: PokemonSpecies,
    uiHandler: StarterSelectUiHandler,
    pokemonCandyCountText: Phaser.GameObjects.Text,
    selectedAttr: number
  ) {
    scene.gameData.starterData[lastSpecies.speciesId].abilityAttr = scene.gameData.starterData[lastSpecies.speciesId].abilityAttr | selectedAttr;

    scene.gameData.starterData[lastSpecies.speciesId].candyCount -= this.unlockAbilityPrice(selectedAttr, lastSpecies);
    pokemonCandyCountText.setText(`x${scene.gameData.starterData[lastSpecies.speciesId].candyCount}`);

    uiHandler.setSpecies(lastSpecies);
    uiHandler.updateInstructions();
    uiHandler.setSpeciesDetails(lastSpecies, undefined, undefined, undefined, undefined, undefined, undefined);

    scene.gameData.saveSystem().then((success) => {
      if (!success) {
        return scene.reset(true);
      }
    });
    ui.setMode(Mode.STARTER_SELECT);
    return true;
  }

  protected unlockAbilityPrice(abilityIndex: integer, species: PokemonSpecies): integer {
    const basePokemonValue = speciesStarterCosts[species.speciesId];
    const isHA = abilityIndex === 4 ? 1 : 0;

    const baseCost = 20 - 2.5 * (basePokemonValue - 1);

    return Math.ceil(baseCost * (1 + isHA)) * this.candyCostMultiplier;
  }

  getAbilityName(selectedAbilityIndex: integer, species: PokemonSpecies): String {
    const abilityId = selectedAbilityIndex === 1 ? species.ability1 : selectedAbilityIndex === 2 ? species.ability2 : species.abilityHidden;
    return allAbilities[abilityId].name;
  }

  getAllAbilityAttr(lastSpecies: PokemonSpecies): number[] {
    const allAbilityAttr: number[] = [
      AbilityAttr.ABILITY_1,
      ...(lastSpecies.getAbilityCount() === 2 ? [ AbilityAttr.ABILITY_HIDDEN ] : []),
      ...(lastSpecies.getAbilityCount() === 3 ? [ AbilityAttr.ABILITY_HIDDEN, AbilityAttr.ABILITY_2 ] : []),
    ];
    return allAbilityAttr;
  }

  hasAllAbilityAttrs(lastSpecies: PokemonSpecies, abilityAttr: number): boolean {
    const allAbilityAttr = this.getAllAbilityAttr(lastSpecies);
    const unlockedAbilityAttr = [ abilityAttr & AbilityAttr.ABILITY_1, abilityAttr & AbilityAttr.ABILITY_2, abilityAttr & AbilityAttr.ABILITY_HIDDEN ].filter(
      (a) => a
    );

    return allAbilityAttr.every((attr) => unlockedAbilityAttr.includes(attr));
  }

  /**
   * IV improvement store
   */
  showIVsUnlock(
    scene: BattleScene,
    ui: BattleScene["ui"],
    lastSpecies: PokemonSpecies,
    candyCount: any,
    uiHandler: StarterSelectUiHandler,
    pokemonCandyCountText: Phaser.GameObjects.Text
  ) {
    const options = [];

    for (let stat = 0; stat < 6; stat++) {
      if (scene.gameData.dexData[lastSpecies.speciesId].ivs[stat] < 31) {
        options.push({
          label: `x${this.improveIVPrice(lastSpecies)} Improve ${this.getStatName(stat)}`,
          handler: () => {
            if (candyCount >= this.improveIVPrice(lastSpecies)) {
              this.improveIV(scene, ui, lastSpecies, uiHandler, pokemonCandyCountText, stat);
            }
            return false;
          },
          item: "candy",
          itemArgs: starterColors[lastSpecies.speciesId],
        });
      }
    }

    options.push({
      label: i18next.t("menu:cancel"),
      handler: () => {
        ui.setMode(Mode.STARTER_SELECT);
        return true;
      },
    });
    ui.setModeWithoutClear(Mode.OPTION_SELECT, {
      options: options,
      yOffset: 47,
    });
  }

  protected improveIV(
    scene: BattleScene,
    ui: BattleScene["ui"],
    lastSpecies: PokemonSpecies,
    uiHandler: StarterSelectUiHandler,
    pokemonCandyCountText: Phaser.GameObjects.Text,
    stat: number
  ) {
    const IVs = scene.gameData.dexData[lastSpecies.speciesId].ivs;
    IVs[stat] = Math.min(IVs[stat] + 5, 31);

    scene.gameData.updateSpeciesDexIvs(lastSpecies.speciesId, IVs);

    scene.gameData.starterData[lastSpecies.speciesId].candyCount -= this.improveIVPrice(lastSpecies);
    pokemonCandyCountText.setText(`x${scene.gameData.starterData[lastSpecies.speciesId].candyCount}`);

    uiHandler.setSpecies(lastSpecies);
    uiHandler.updateInstructions();
    uiHandler.setSpeciesDetails(lastSpecies, undefined, undefined, undefined, undefined, undefined, undefined);

    scene.gameData.saveSystem().then((success) => {
      if (!success) {
        return scene.reset(true);
      }
    });
    ui.setMode(Mode.STARTER_SELECT);
    return true;
  }

  protected improveIVPrice(species: PokemonSpecies, modifier?: number): integer {
    return Math.round((speciesStarterCosts[species.speciesId] > 5 ? 3 : speciesStarterCosts[species.speciesId] > 3 ? 4 : 5) * this.candyCostMultiplier);
  }

  /**
   * Nature unlock store
   */
  showNatureUnlock(scene: BattleScene,
    ui: BattleScene["ui"],
    lastSpecies: PokemonSpecies,
    candyCount: any,
    uiHandler: StarterSelectUiHandler,
    pokemonCandyCountText: Phaser.GameObjects.Text) {

    const options = [];
    for (let nature = 0; nature < 25; nature++) {
      if (!(scene.gameData.dexData[lastSpecies.speciesId].natureAttr & Math.pow(2, nature + 1))) {
        options.push({
          label: `x${this.unlockNaturePrice(lastSpecies)} Improve ${getNatureName(nature)}`,
          handler: () => {
            if (candyCount >= this.unlockNaturePrice(lastSpecies)) {
              this.unlockNature(scene, ui, lastSpecies, uiHandler, pokemonCandyCountText, nature);
            }
            return false;
          }
        });
      }
    }
    this.showStarterSelectOptions(options, ui);
  }

  protected unlockNature(
    scene: BattleScene,
    ui: UI,
    lastSpecies: PokemonSpecies,
    uiHandler: StarterSelectUiHandler,
    pokemonCandyCountText: Phaser.GameObjects.Text,
    selectedNature: number
  ) {
    scene.gameData.dexData[lastSpecies.speciesId].natureAttr |= Math.pow(2, selectedNature + 1);

    scene.gameData.starterData[lastSpecies.speciesId].candyCount -= this.unlockNaturePrice(lastSpecies);
    pokemonCandyCountText.setText(`x${scene.gameData.starterData[lastSpecies.speciesId].candyCount}`);

    uiHandler.setSpecies(lastSpecies);
    uiHandler.updateInstructions();
    uiHandler.setSpeciesDetails(lastSpecies, undefined, undefined, undefined, undefined, undefined, undefined);

    scene.gameData.saveSystem().then((success) => {
      if (!success) {
        return scene.reset(true);
      }
    });
    ui.setMode(Mode.STARTER_SELECT);
    return true;
  }

  protected unlockNaturePrice(species: PokemonSpecies): integer {
    return Math.round((speciesStarterCosts[species.speciesId] > 5 ? 6 : speciesStarterCosts[species.speciesId] > 3 ? 8 : 10) * this.candyCostMultiplier);
  }

  hasAllNatures(scene: BattleScene, lastSpecies: PokemonSpecies): boolean {
    const allNatures = (1 << 26) - 2; // = 25 bits set to 1
    return (scene.gameData.dexData[lastSpecies.speciesId].natureAttr & allNatures) === allNatures;
  }

  /*
  * Regen Completed Pokemon
  */
  regenerateCompletedPokemon(species: Species, scene: BattleScene): boolean {
    let regen = false;

    if (Utils.randInt(100) <= this.regenPokeChance) {
      const dexEntry = scene.gameData.dexData[getPokemonSpecies(species).getRootSpeciesId()];
      const abilityAttr = scene.gameData.starterData[getPokemonSpecies(species).getRootSpeciesId()].abilityAttr;
      const genderRatio = getPokemonSpecies(species).malePercent;

      const gendersUncaught = !(
        (dexEntry.caughtAttr & DexAttr.MALE && dexEntry.caughtAttr & DexAttr.FEMALE) ||
        genderRatio === null ||
        (genderRatio === 0 && dexEntry.caughtAttr & DexAttr.FEMALE) ||
        (genderRatio === 100 && dexEntry.caughtAttr & DexAttr.MALE)
      );
      const formsUncaught = !!getPokemonSpecies(species)
        .forms.filter((f) => !f.formKey || !pokemonFormChanges[species]?.find((fc) => fc.formKey))
        .map((_, f) => !(dexEntry.caughtAttr & scene.gameData.getFormAttr(f)))
        .filter((f) => f).length;

      const allAbilityAttr = this.getAllAbilityAttr(getPokemonSpecies(species));
      const unlockedAbilityAttr = [ abilityAttr & AbilityAttr.ABILITY_1, abilityAttr & AbilityAttr.ABILITY_2, abilityAttr & AbilityAttr.ABILITY_HIDDEN ].filter((a) => a);
      const abilitiesUncaught = !allAbilityAttr.filter((item) => !unlockedAbilityAttr.includes(item));
      regen = !(gendersUncaught || formsUncaught || abilitiesUncaught);
    }

    return regen;
  }

  /**
   * Random Team generator
   */
  generateRandomTeam(handler: StarterSelectUiHandler, scene: BattleScene, genSpecies: PokemonSpecies[][]) {
    const maxAttempts = 200;

    async function generateMon() {
      for (let loop = 0; loop < maxAttempts; loop++) {
        const randomGenIndex = Utils.randInt(8, 0);
        const randomCursorIndex = Utils.randInt(80, 0);
        const species = genSpecies[randomGenIndex][randomCursorIndex];

        if (!handler.tryUpdateValue(0.1)) {
          return;
        }

        console.log("Loop:" + loop);
        if (!species || !handler.tryUpdateValue(scene.gameData.getSpeciesStarterValue(species.speciesId))) {
          continue;
        }
        handler.setGen(randomGenIndex);
        await handler.addToParty(randomCursorIndex);

        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    generateMon();
  }

  /**
   * Weather UI
   */
  updateWeatherText(scene: BattleScene) {
    console.log("Weather: " + scene.arena?.weather?.weatherType);
    if (scene.arena?.weather?.weatherType === undefined || scene.arena?.weather?.weatherType === WeatherType.NONE) {
      scene.weatherText.setText("Clear");
      scene.weatherText.setVisible(false);
    } else {
      const weatherType = scene.arena.weather?.weatherType;
      const turnsLeft = scene.arena.weather?.turnsLeft;
      const turnsLeftText = turnsLeft > 0 ? turnsLeft : "";

      scene.weatherText.setText(`${this.getWeatherName(weatherType)} ${turnsLeftText}`);
      scene.weatherText.setVisible(true);
    }
  }

  getWeatherName(weatherType: WeatherType): String {
    switch (weatherType) {
      case WeatherType.NONE:
        return "Clear";
      case WeatherType.SUNNY:
        return "Sun";
      case WeatherType.RAIN:
        return "Rain";
      case WeatherType.SANDSTORM:
        return "Sandstorm";
      case WeatherType.HAIL:
        return "Hail";
      case WeatherType.SNOW:
        return "Snow";
      case WeatherType.FOG:
        return "Fog";
      case WeatherType.HEAVY_RAIN:
        return "Heavy Rain";
      case WeatherType.HARSH_SUN:
        return "Harsh Sun";
      case WeatherType.STRONG_WINDS:
        return "Strong Winds";
    }
  }

  updateTerrainText(scene: BattleScene) {
    console.log("Terrain: " + scene.arena?.terrain?.terrainType);
    if (scene.arena?.terrain?.terrainType === undefined || scene.arena?.terrain?.terrainType === TerrainType.NONE) {
      scene.terrainText.setVisible(false);
    } else {
      const terrainType = scene.arena?.terrain?.terrainType;
      const turnsLeft = scene.arena?.terrain?.turnsLeft;
      const turnsLeftText = turnsLeft > 0 ? turnsLeft : "";

      scene.terrainText.setText(`${this.getTerrainName(terrainType)} ${turnsLeftText}`);

      scene.updateBattleInfoOverlayPosition();
      scene.terrainText.setVisible(true);
    }
  }

  getTerrainName(terrainType: TerrainType): String {
    switch (terrainType) {
      case TerrainType.ELECTRIC:
        return "Electric Terrain";
      case TerrainType.GRASSY:
        return "Grassy Terrain";
      case TerrainType.MISTY:
        return "Misty Terrain";
      case TerrainType.PSYCHIC:
        return "Psychic Terrain";
      default:
        return "No Terrain";
    }
  }

  /**
   * Cheat Menu
   */
  showCheatMenu(scene: BattleScene, isPlayer: boolean, typeOptions: ModifierTypeOption[], modifierSelectCallback, rerollCost: number, party: Pokemon[]) {
    const exit = () => scene.ui.setMode(Mode.MODIFIER_SELECT, isPlayer, typeOptions, modifierSelectCallback, rerollCost);
    const sceneSwap = (innerOptions) => exit().then(() => {
      scene.ui.setModeWithoutClear(Mode.OPTION_SELECT, {
        options: innerOptions,
        maxOptions: 8,
        yOffset: 47,
      });
    });

    const modifierCategories: Promise<ItemCategory[]> = this.createModifierCategories(party);
    modifierCategories.then((categories: ItemCategory[]) => {
      this.createCheatOptions(categories, sceneSwap, exit, exit, scene);
    });
  }

  private createCheatOptions(categories: any[], sceneSwap: Function, exit: Function, cancelFunction: Function, scene: BattleScene) {
    const options = [];

    const nextCancelFunction = () => sceneSwap(options);

    for (const item of categories) {
      if (item instanceof ItemCategory) {
        options.push({
          label: item.categoryName,
          handler: () => this.createCheatOptions(item.array, sceneSwap, exit, nextCancelFunction, scene)
        });
      } else {
        options.push({
          label: item.name,
          handler: () => {
            exit();
            this.applyModifierType(item as ModifierType, scene, nextCancelFunction);
          }
        });
      }
    }
    options.push({
      label: i18next.t("menu:cancel"),
      handler: cancelFunction
    });

    sceneSwap(options);
  }

  private async createModifierCategories(party: Pokemon[]): Promise<ItemCategory[]> {

    //Import dynamically to ensure mods work without cheat menu module loaded
    let AddPokeballModifierType: any;
    let AddVoucherModifierType: any;
    let AllPokemonFullReviveModifierType: any;
    let SpeciesStatBoosterModifierTypeGenerator: any;
    try {
      ({ AddPokeballModifierType } = await import("./modifier/modifier-type"));
      ({ AddVoucherModifierType } = await import("./modifier/modifier-type"));
      ({ AllPokemonFullReviveModifierType } = await import("./modifier/modifier-type"));
      ({ SpeciesStatBoosterModifierTypeGenerator } = await import("./modifier/modifier-type"));
    } catch (e) {
      console.log("Error importing files from cheat menu." + e);
      return null;
    }

    const allModifierTypes = Object.values(modifierTypes).map(fn => fn()).filter(modifier => modifier.localeKey !== null);

    //Healing
    const healingItems = new ItemCategory("Healing", [
      new ItemCategory("HP Healing", [
        ...allModifierTypes.filter(modifier =>
          [ PokemonHpRestoreModifierType ].some(type => modifier instanceof type)) ]),
      new ItemCategory("PP Restoring", [
        ...allModifierTypes.filter(modifier =>
          [ PokemonPpRestoreModifierType, PokemonAllMovePpRestoreModifierType ].some(type => modifier instanceof type)),
        ...allModifierTypes.filter(modifier =>
          [ PokemonMoveModifierType ].some(type => modifier instanceof type)) ]),
      new ItemCategory("Revives", [
        ...allModifierTypes.filter(modifier =>
          [ PokemonReviveModifierType, AllPokemonFullReviveModifierType ].some(type => modifier instanceof type)) ]),
      new ItemCategory("Status Healing", [
        ...allModifierTypes.filter(modifier =>
          [ PokemonStatusHealModifierType ].some(type => modifier instanceof type)) ]) ]);

    //Pokeballs
    const pokeballs = new ItemCategory("Pokeballs", [
      ...allModifierTypes.filter(modifier =>
        [ AddPokeballModifierType ].some(type => modifier instanceof type)) ]);

    //Lure
    const lures = new ItemCategory("Lures", [
      ...allModifierTypes.filter(modifier =>
        [ DoubleBattleChanceBoosterModifierType ].some(type => modifier instanceof type)) ]);

    //Misc
    const miscConsumables = new ItemCategory("Misc", [
      ...allModifierTypes.filter(modifier =>
        [ FusePokemonModifierType ].some(type => modifier instanceof type)),
      ...allModifierTypes.filter(modifier =>
        [ RememberMoveModifierType ].some(type => modifier instanceof type)) ]);

    //Exp
    const expItems = new ItemCategory("Exp Items", [
      ...allModifierTypes.filter(modifier =>
        [ ExpBoosterModifierType, PokemonExpBoosterModifierType ].some(type => modifier instanceof type)),
      ...allModifierTypes.filter(modifier =>
        [ PokemonLevelIncrementModifierType, AllPokemonLevelIncrementModifierType ].some(type => modifier instanceof type)) ]);

    //Voucher
    const vouchers = new ItemCategory("Vouchers", [
      ...allModifierTypes.filter(modifier =>
        [ AddVoucherModifierType ].some(type => modifier instanceof type)) ]);

    //Money
    const moneyItems = new ItemCategory("Money Items", [
      ...allModifierTypes.filter(modifier =>
        [ MoneyRewardModifierType ].some(type => modifier instanceof type)) ]);

    //Misc
    const remaining = this.removeDuplicateModifierTypes(
      allModifierTypes, ItemCategory.combineToArray([ healingItems, pokeballs, lures, miscConsumables, expItems, vouchers, moneyItems ]));
    const otherHeldItems = new ItemCategory("Misc Held Items", [
      ...remaining.filter(modifier => modifier instanceof PokemonHeldItemModifierType) ]);
    const globalMisc = new ItemCategory("Misc Global Items", [
      ...this.removeDuplicateModifierTypes(remaining, otherHeldItems.array).filter(modifier => !(modifier instanceof TempStatStageBoosterModifierType)) ]);

    const tms = new ItemCategory("TMs (learned next battle)", this.generateTMs(party));
    const formChangeItems = new ItemCategory("Evolution", [
      ...this.generateEvolutionItems(party), ...this.generateFormChangeItems(party) ]);
    const teraItems = new ItemCategory("Tera Shards", this.generateTeraShards());
    const berries = new ItemCategory("Berries", this.generateBerries());
    const natureChangeItems = new ItemCategory("Nature Mints", this.generateMints());
    const statBoosters = new ItemCategory("Stat Boosters", [
      new ItemCategory("Base Stats", this.generateBaseStatBoosters()),
      new ItemCategory("Temporary", this.generateTempStatBoosters()),
      new ItemCategory("Species Specific", this.generateSpeciesStatBoosters(party, SpeciesStatBoosterModifierTypeGenerator))
    ]);
    const attackTypeBoosters = new ItemCategory("Type Boosters", this.generateAttackTypeBooster());

    //Major Categories
    const pokemonItems = new ItemCategory("Pokemon Items", [
      otherHeldItems, healingItems, miscConsumables, expItems, tms, formChangeItems,
      berries, statBoosters, attackTypeBoosters, natureChangeItems, teraItems
    ]);
    const globalItems = new ItemCategory("Global Items", [
      globalMisc, pokeballs, lures, vouchers, moneyItems ]);

    return [ globalItems, pokemonItems ];
  }

  private generateEvolutionItems(party: Pokemon[]): EvolutionItemModifierType[] {
    //from modifier-type.ts
    const evolutionItemPool = [
      party.filter(p => pokemonEvolutions.hasOwnProperty(p.species.speciesId)).map(p => {
        const evolutions = pokemonEvolutions[p.species.speciesId];
        return evolutions.filter(e => e.item !== EvolutionItem.NONE && (e.evoFormKey === null || (e.preFormKey || "") === p.getFormKey()) && (!e.condition || e.condition.predicate(p)));
      }).flat(),
      party.filter(p => p.isFusion() && pokemonEvolutions.hasOwnProperty(p.fusionSpecies.speciesId)).map(p => {
        const evolutions = pokemonEvolutions[p.fusionSpecies.speciesId];
        return evolutions.filter(e => e.item !== EvolutionItem.NONE && (e.evoFormKey === null || (e.preFormKey || "") === p.getFusionFormKey()) && (!e.condition || e.condition.predicate(p)));
      }).flat()
    ].flat().flatMap(e => e.item);

    const evolutionModifiers = evolutionItemPool.map(item => new EvolutionItemModifierType(item));

    return evolutionModifiers;
  }

  private generateTMs(party: Pokemon[]): TmModifierType[] {
    const movesPerPoke = party.map(pokemon => (pokemon as PlayerPokemon).compatibleTms.filter(tm => !pokemon.moveset.find(move => move.moveId === tm)));
    const tmModifiers = [ ...new Set(movesPerPoke.flat()) ].map(move => new TmModifierType(move));
    return tmModifiers;
  }

  private generateFormChangeItems(party: Pokemon[]): FormChangeItemModifierType[] {
    //from modifier-type.ts
    const formChangeItemPool = party.filter(p => pokemonFormChanges.hasOwnProperty(p.species.speciesId)).map(p => {
      const formChanges = pokemonFormChanges[p.species.speciesId];
      return formChanges.filter(fc => ((fc.formKey.indexOf(SpeciesFormKey.MEGA) === -1 && fc.formKey.indexOf(SpeciesFormKey.PRIMAL) === -1) || party[0].scene.getModifiers(Modifiers.MegaEvolutionAccessModifier).length)
        && ((fc.formKey.indexOf(SpeciesFormKey.GIGANTAMAX) === -1 && fc.formKey.indexOf(SpeciesFormKey.ETERNAMAX) === -1) || party[0].scene.getModifiers(Modifiers.GigantamaxAccessModifier).length))
        .map(fc => fc.findTrigger(SpeciesFormChangeItemTrigger) as SpeciesFormChangeItemTrigger)
        .filter(t => t && t.active && !p.scene.findModifier(m => m instanceof Modifiers.PokemonFormChangeItemModifier && m.pokemonId === p.id && m.formChangeItem === t.item));
    }).flat().flatMap(fc => fc.item);

    return formChangeItemPool.map(item => new FormChangeItemModifierType(item));
  }

  private generateTeraShards(): TerastallizeModifierType[] {
    const typeCount = Utils.getEnumValues(Type).length - 1;
    return Array.from({ length: typeCount }, (_, i) => i).map(type => new TerastallizeModifierType(type as Type));
  }

  private generateBerries(): BerryModifierType[] {
    const berryCount = Utils.getEnumValues(BerryType).length;
    return Array.from({ length: berryCount }, (_, i) => i).map(berry => new BerryModifierType(berry as BerryType));
  }

  private generateMints(): PokemonNatureChangeModifierType[] {
    const natureCount = Utils.getEnumValues(Nature).length;
    return Array.from({ length: natureCount }, (_, i) => i).map(nature => new PokemonNatureChangeModifierType(nature as Nature));
  }

  private generateBaseStatBoosters(): BaseStatBoosterModifierType[] {
    const baseStatCount = Utils.getEnumValues(Stat).length;
    return Array.from({ length: baseStatCount }, (_, i) => i).map(stat => new BaseStatBoosterModifierType(this.getBaseStatBoosterItemName(stat as Stat), stat as Stat));
  }

  private generateTempStatBoosters(): TempStatStageBoosterModifierType[] {
    const baseStatCount = Utils.getEnumValues(Stat).length + 1; //+1 for crit
    return Array.from({ length: baseStatCount }, (_, i) => i).map(stat => new TempStatStageBoosterModifierType(stat as TempBattleStat));
  }

  private generateSpeciesStatBoosters(party: Pokemon[], SpeciesStatBoosterModifierTypeGenerator: any): SpeciesStatBoosterModifierType[] {
    const keys = Object.keys(SpeciesStatBoosterModifierTypeGenerator.items);
    const values = Object.values(SpeciesStatBoosterModifierTypeGenerator.items).map(value => (value as typeof SpeciesStatBoosterModifierTypeGenerator).species);

    let output: SpeciesStatBoosterModifierType[] = [];

    for (const pokemon of party) {
      for (const index in values) {
        if (values[index].includes(pokemon.getSpeciesForm(true).speciesId)) {
          output = [ new SpeciesStatBoosterModifierType(keys[index] as SpeciesStatBoosterItem), ...output ];
        } else if (values[index].includes(Species.PIKACHU) && pokemon.getMoveset(true).some(move => move.moveId === Moves.FLING)) {
          output = [ new SpeciesStatBoosterModifierType(keys[index] as SpeciesStatBoosterItem), ...output ];
        }
      }
    }

    return [ ...new Set(output) ];
  }

  private generateAttackTypeBooster(): AttackTypeBoosterModifierType[] {
    const typeCount = Utils.getEnumValues(Type).length - 2; //-2 to remove stellar
    return Array.from({ length: typeCount }, (_, i) => i).map(type => new AttackTypeBoosterModifierType(type as Type, 20));
  }

  private getBaseStatBoosterItemName(stat: Stat) {
    switch (stat) {
      case Stat.HP:
        return "HP Up";
      case Stat.ATK:
        return "Protein";
      case Stat.DEF:
        return "Iron";
      case Stat.SPATK:
        return "Calcium";
      case Stat.SPDEF:
        return "Zinc";
      case Stat.SPD:
        return "Carbos";
    }
  }

  private removeDuplicateModifierTypes(allModifierTypes: ModifierType[], ...modifierTypes: ModifierType[][]): ModifierType[] {
    return allModifierTypes.filter(modifier => !modifierTypes.some(arr => arr.includes(modifier)));
  }

  protected showStarterSelectOptions(options: any[], ui: UI) {
    const cancelHandler = () => ui.setMode(Mode.STARTER_SELECT);
    const sceneSwap = (newOptions: any[]) => ui.setMode(Mode.STARTER_SELECT).then(() =>
      ui.setModeWithoutClear(Mode.OPTION_SELECT, {
        options: newOptions,
        maxOptions: 8,
        yOffset: 47,
      }));

    this.showOptions(options, cancelHandler, sceneSwap);
  }

  protected showOptions(options: any[], cancelHandler: () => void, sceneSwap: (options: any[]) => void) {
    options.push({
      label: i18next.t("menu:cancel"),
      handler: cancelHandler
    });
    sceneSwap(options);
  }

  protected applyModifierType(modifierType: ModifierType, scene: BattleScene, cancelFunction: Function) {
    const party = scene.getParty();
    if (modifierType instanceof PokemonModifierType) {
      if (modifierType instanceof FusePokemonModifierType) {
        scene.ui.setModeWithoutClear(Mode.PARTY, PartyUiMode.SPLICE, -1, (fromSlotIndex: integer, spliceSlotIndex: integer) => {
          if (spliceSlotIndex !== undefined && fromSlotIndex < 6 && spliceSlotIndex < 6 && fromSlotIndex !== spliceSlotIndex) {
            scene.ui.setMode(Mode.MODIFIER_SELECT, true).then(() => {
              const modifier = modifierType.newModifier(party[fromSlotIndex], party[spliceSlotIndex]);
              scene.addModifier(modifier, false, true).then(() => cancelFunction());
            });
          } else {
            cancelFunction();
          }
        }, modifierType.selectFilter);
      } else {
        const pokemonModifierType = modifierType as PokemonModifierType;
        const isMoveModifier = modifierType instanceof PokemonMoveModifierType;
        const isTmModifier = modifierType instanceof TmModifierType;
        const isRememberMoveModifier = modifierType instanceof RememberMoveModifierType;
        const isPpRestoreModifier = (modifierType instanceof PokemonPpRestoreModifierType || modifierType instanceof PokemonPpUpModifierType);
        const partyUiMode = isMoveModifier ? PartyUiMode.MOVE_MODIFIER
          : isTmModifier ? PartyUiMode.TM_MODIFIER
            : isRememberMoveModifier ? PartyUiMode.REMEMBER_MOVE_MODIFIER
              : PartyUiMode.MODIFIER;
        const tmMoveId = isTmModifier
          ? (modifierType as TmModifierType).moveId
          : undefined;
        console.log("ID: " + tmMoveId);
        scene.ui.setModeWithoutClear(Mode.PARTY, partyUiMode, -1, (slotIndex: integer, option: PartyOption) => {
          if (slotIndex < 6) {
            scene.ui.setMode(Mode.MODIFIER_SELECT, true).then(() => {
              let modifier: Modifiers.Modifier;
              if (isMoveModifier) {
                modifier = modifierType.newModifier(party[slotIndex], option - PartyOption.MOVE_1);
              } else if (isRememberMoveModifier) {
                modifier = modifierType.newModifier(party[slotIndex], option as integer);
              } else {
                modifier = modifierType.newModifier(party[slotIndex]);
              }
              scene.addModifier(modifier, false, true).then(() => cancelFunction());
            });
          } else {
            cancelFunction();
          }
        }, pokemonModifierType.selectFilter, modifierType instanceof PokemonMoveModifierType ? (modifierType as PokemonMoveModifierType).moveSelectFilter : undefined, tmMoveId, isPpRestoreModifier);
      }
    } else {
      scene.addModifier(modifierType.newModifier(), false, true, false, true).then(() => cancelFunction());
    }
  }

  restartBattle(scene: BattleScene) {

    const cancel = () => scene.ui.setMode(Mode.COMMAND);

    scene.ui.setMode(Mode.MESSAGE).then(() => {
      scene.ui.showText("Would you like to retry from the start of the battle?", null, () => {
        scene.ui.setMode(Mode.CONFIRM, () => {
          scene.ui.fadeOut(1250).then(() => {
            scene.reset();
            scene.clearPhaseQueue();
            scene.gameData.loadSession(scene, scene.sessionSlotId).then(() => {
              scene.pushPhase(new EncounterPhase(scene, true));

              const availablePartyMembers = scene.getParty().filter(p => p.isAllowedInBattle()).length;

              scene.pushPhase(new SummonPhase(scene, 0));
              if (scene.currentBattle.double && availablePartyMembers > 1) {
                scene.pushPhase(new SummonPhase(scene, 1));
              }
              if (scene.currentBattle.waveIndex > 1 && scene.currentBattle.battleType !== BattleType.TRAINER) {
                scene.pushPhase(new CheckSwitchPhase(scene, 0, scene.currentBattle.double));
                if (scene.currentBattle.double && availablePartyMembers > 1) {
                  scene.pushPhase(new CheckSwitchPhase(scene, 1, scene.currentBattle.double));
                }
              }

              scene.ui.fadeIn(1250);
              scene.shiftPhase();
            });
          });
        }, () => cancel(), false, 0, 0, 1000);
      }, 0, false, 0);
    });
  }
}

class ItemCategory {
  categoryName: string;
  array: any[];

  constructor(categoryName: string, array: any[]) {
    this.categoryName = categoryName;
    this.array = array;
  }

  static combineToArray(categories: ItemCategory[], existingArray: any[] = []): any[] {
    const out = existingArray ? existingArray : [];
    for (const category of categories) {
      for (const item of category.array) {
        if (item instanceof ItemCategory) {
          out.push(...ItemCategory.combineToArray([ item ]));
        } else {
          out.push(item);
        }
      }
    }
    return out;
  }
}
