import { SimpleTranslationEntries } from "#app/interfaces/locales";

export const battle: SimpleTranslationEntries = {
  "bossAppeared": "{{bossName}}[[가]] 나타났다.",
  "trainerAppeared": "{{trainerName}}[[가]]\n승부를 걸어왔다!",
  "trainerAppearedDouble": "{{trainerName}}[[가]]\n승부를 걸어왔다!",
  "trainerSendOut": "{{trainerName}}[[는]]\n{{pokemonName}}[[를]] 내보냈다!",
  "singleWildAppeared": "앗! 야생 {{pokemonName}}[[가]]\n튀어나왔다!",
  "multiWildAppeared": "야생 {{pokemonName1}}[[와]]\n{{pokemonName2}}[[가]] 튀어나왔다!",
  "playerComeBack": "돌아와, {{pokemonName}}!",
  "trainerComeBack": "{{trainerName}}[[는]] {{pokemonName}}[[를]] 넣어버렸다!",
  "playerGo": "가랏! {{pokemonName}}!",
  "trainerGo": "{{trainerName}}[[는]] {{pokemonName}}[[를]] 내보냈다!",
  "switchQuestion": "{{pokemonName}}[[를]]\n교체하시겠습니까?",
  "trainerDefeated": "{{trainerName}}[[와]]의\n승부에서 이겼다!",
  "moneyWon": "상금으로\n₽{{moneyAmount}}을 손에 넣었다!",
  "pokemonCaught": "신난다-!\n{{pokemonName}}[[를]] 잡았다!",
  "addedAsAStarter": "{{pokemonName}}[[가]]\n스타팅 포켓몬에 추가되었다!",
  "partyFull": "지닌 포켓몬이 가득 찼습니다. {{pokemonName}}[[를]]\n대신해 포켓몬을 놓아주시겠습니까?",
  "pokemon": "포켓몬",
  "sendOutPokemon": "가랏! {{pokemonName}}!",
  "hitResultCriticalHit": "급소에 맞았다!",
  "hitResultSuperEffective": "효과가 굉장했다!",
  "hitResultNotVeryEffective": "효과가 별로인 듯하다…",
  "hitResultNoEffect": "{{pokemonName}}에게는\n효과가 없는 것 같다…",
  "hitResultOneHitKO": "일격필살!",
  "attackFailed": "하지만 실패했다!",
  "attackHitsCount": "{{count}}번 맞았다!",
  "rewardGain": "{{modifierName}}[[를]] 받았다!",
  "expGain": "{{pokemonName}}[[는]]\n{{exp}} 경험치를 얻었다!",
  "levelUp": "{{pokemonName}}[[는]]\n레벨 {{level}}[[로]] 올랐다!",
  "learnMove": "{{pokemonName}}[[는]] 새로\n{{moveName}}[[를]] 배웠다!",
  "learnMovePrompt": "{{pokemonName}}[[는]] 새로\n{{moveName}}[[를]] 배우고 싶다!…",
  "learnMoveLimitReached": "그러나 {{pokemonName}}[[는]] 기술을 4개\n알고 있으므로 더 이상 배울 수 없다!",
  "learnMoveReplaceQuestion": "{{moveName}} 대신 다른 기술을 잊게 하겠습니까?",
  "learnMoveStopTeaching": "그럼… {{moveName}}[[를]]\n배우는 것을 포기하겠습니까?",
  "learnMoveNotLearned": "{{pokemonName}}[[는]] {{moveName}}[[를]]\n결국 배우지 않았다!",
  "learnMoveForgetQuestion": "어느 기술을 잊게 하고싶은가?",
  "learnMoveForgetSuccess": "{{pokemonName}}[[는]] {{moveName}}[[를]] 깨끗이 잊었다!",
  "countdownPoof": "@d{32}1, @d{15}2, @d{15}… @d{15}… @d{30}@s{pb_bounce_1}짠!",
  "learnMoveAnd": "그리고…",
  "levelCapUp": "레벨의 최대치가\n{{levelCap}}까지 상승했다!",
  "moveNotImplemented": "{{moveName}}[[는]] 아직 구현되지 않아 사용할 수 없다…",
  "moveNoPP": "기술의 남은 포인트가 없다!",
  "moveDisabled": "{{moveName}}[[를]] 쓸 수 없다!",
  "noPokeballForce": "본 적 없는 힘이\n볼을 사용하지 못하게 한다.",
  "noPokeballTrainer": "다른 트레이너의 포켓몬은 잡을 수 없다!",
  "noPokeballMulti": "안돼! 2마리 있어서\n목표를 정할 수가 없어…!",
  "noPokeballStrong": "너무 강해서 잡을 수가 없다!\n먼저 약화시켜야 한다!",
  "noEscapeForce": "본 적 없는 힘이\n도망칠 수 없게 한다.",
  "noEscapeTrainer": "안돼! 승부 도중에\n상대에게 등을 보일 순 없어!",
  "noEscapePokemon": "{{pokemonName}}의 {{moveName}}때문에\n{{escapeVerb}} 수 없다!",
  "runAwaySuccess": "무사히 도망쳤다!",
  "runAwayCannotEscape": "도망칠 수 없었다!",
  "escapeVerbSwitch": "교체할",
  "escapeVerbFlee": "도망칠",
  "notDisabled": "{{pokemonName}}의\n{{moveName}} 사슬묶기가 풀렸다!",
  "turnEndHpRestore": "{{pokemonName}}의\n체력이 회복되었다!",
  "hpIsFull": "그러나 {{pokemonName}}의\n체력이 가득 찬 상태다!",
  "skipItemQuestion": "아이템을 받지 않고 넘어가시겠습니까?",
  "eggHatching": "어라…?",
  "ivScannerUseQuestion": "{{pokemonName}}에게 개체값탐지기를 사용하시겠습니까?",
  "wildPokemonWithAffix": "야생 {{pokemonName}}",
  "foePokemonWithAffix": "상대 {{pokemonName}}",
  "useMove": "{{pokemonNameWithAffix}}의 {{moveName}}!",
  "drainMessage": "{{pokemonName}}[[로]]부터\n체력을 흡수했다!",
  "stealEatBerry": "{{pokemonName}}[[가]]\n{{targetName}}의 {{berryName}}[[를]] 빼앗아 먹었다!",
  "regainHealth": "{{pokemonName}}[[는]]\n체력을 회복했다!",
  "fainted": "{{pokemonNameWithAffix}}[[는]] 쓰러졌다!",
  "statRose": "{{pokemonNameWithAffix}}의\n{{stats}}[[가]] 올라갔다!",
  "statSharplyRose": "{{pokemonNameWithAffix}}의\n{{stats}}[[가]] 크게 올라갔다!",
  "statRoseDrastically": "{{pokemonNameWithAffix}}의\n{{stats}}[[가]] 매우 크게 올라갔다!",
  "statWontGoAnyHigher": "{{pokemonNameWithAffix}}의\n{{stats}}[[는]] 더 올라가지 않는다!",
  "statFell": "{{pokemonNameWithAffix}}의\n{{stats}}[[가]] 떨어졌다!",
  "statHarshlyFell": "{{pokemonNameWithAffix}}의\n{{stats}}[[가]] 크게 떨어졌다!",
  "statSeverelyFell": "{{pokemonNameWithAffix}}의\n{{stats}}[[가]] 매우 크게 떨어졌다!",
  "statWontGoAnyLower": "{{pokemonNameWithAffix}}의\n{{stats}}[[는]] 더 떨어지지 않는다!",
  "ppReduced": "{{targetName}}의\n{{moveName}}[[를]] {{reduction}} 깎았다!",
  "battlerTagsRechargingLapse": "공격의 반동으로\n{{pokemonNameWithAffix}}[[는]] 움직일 수 없다!",
  "battlerTagsTrappedOnAdd": "{{pokemonNameWithAffix}}[[는]]\n이제 도망칠 수 없다!",
  "battlerTagsTrappedOnRemove": "{{pokemonNameWithAffix}}[[는]]\n{{moveName}}로부터 풀려났다!",
  "battlerTagsFlinchedLapse": "{{pokemonNameWithAffix}}[[는]] 풀이 죽어\n움직일 수 없었다!",
  "battlerTagsConfusedOnAdd": "{{pokemonNameWithAffix}}[[는]]\n혼란에 빠졌다!",
  "battlerTagsConfusedOnRemove": "{{pokemonNameWithAffix}}의\n혼란이 풀렸다!",
  "battlerTagsConfusedOnOverlap": "{{pokemonNameWithAffix}}[[는]]\n이미 혼란에 빠져 있다",
  "battlerTagsConfusedLapse": "{{pokemonNameWithAffix}}[[는]]\n혼란에 빠져 있다!",
  "battlerTagsConfusedLapseHurtItself": "영문도 모른채\n자신을 공격했다!",
  "battlerTagsDestinyBondLapseIsBoss": "{{pokemonNameWithAffix}}[[는]]\n길동무의 영향을 받지 않는다.",
  "battlerTagsDestinyBondLapse": "{{pokemonNameWithAffix}}[[는]] {{pokemonNameWithAffix2}}[[를]]\n길동무로 삼았다!",
  "battlerTagsInfatuatedOnAdd": "{{pokemonNameWithAffix}}[[는]]\n헤롱헤롱해졌다!",
  "battlerTagsInfatuatedOnOverlap": "{{pokemonNameWithAffix}}[[는]]\n이미 헤롱헤롱해있다!",
  "battlerTagsInfatuatedLapse": "{{pokemonNameWithAffix}}[[는]]\n{{sourcePokemonName}}에게 헤롱헤롱해 있다!",
  "battlerTagsInfatuatedLapseImmobilize": "{{pokemonNameWithAffix}}[[는]] 헤롱헤롱해서\n기술을 쓸 수 없었다!",
  "battlerTagsInfatuatedOnRemove": "{{pokemonNameWithAffix}}[[는]]\n헤롱헤롱 상태에서 벗어났다.",
  "battlerTagsSeededOnAdd": "{{pokemonNameWithAffix}}에게\n씨앗을 심었다!",
  "battlerTagsSeededLapse": "씨뿌리기가 {{pokemonNameWithAffix}}의\n체력을 빼앗는다!",
  "battlerTagsSeededLapseShed": "{{pokemonNameWithAffix}}[[는]]\n씨앗을 날려버렸다!",
  "battlerTagsNightmareOnAdd": "{{pokemonNameWithAffix}}[[는]]\n악몽을 꾸기 시작했다!",
  "battlerTagsNightmareOnOverlap": "{{pokemonNameWithAffix}}[[는]]\n이미 악몽을 꾸고 있다!",
  "battlerTagsNightmareLapse": "{{pokemonNameWithAffix}}[[는]]\n악몽에 시달리고 있다!",
  "battlerTagsEncoreOnAdd": "{{pokemonNameWithAffix}}[[는]]\n앙코르를 받았다!",
  "battlerTagsEncoreOnRemove": "{{pokemonNameWithAffix}}의\n앙코르 상태가 풀렸다!",
  "battlerTagsHelpingHandOnAdd": "{{pokemonNameWithAffix}}[[는]] {{pokemonName}}에게\n도우미가 되어주려 한다!",
  "battlerTagsIngrainLapse": "{{pokemonNameWithAffix}}[[는]] 뿌리로부터\n양분을 흡수했다!",
  "battlerTagsIngrainOnTrap": "{{pokemonNameWithAffix}}[[는]] 뿌리를 뻗었다!",
  "battlerTagsAquaRingOnAdd": "{{pokemonNameWithAffix}}[[는]]\n물의 베일을 둘러썼다!",
  "battlerTagsAquaRingLapse": "{{moveName}} 효과로 \n{{pokemonName}}[[는]] HP를 회복했다!",
  "battlerTagsDrowsyOnAdd": "{{pokemonNameWithAffix}}의\n졸음을 유도했다!",
  "battlerTagsDamagingTrapLapse": "{{pokemonNameWithAffix}}[[는]] {{moveName}}의\n데미지를 입고 있다!",
  "battlerTagsBindOnTrap": "{{pokemonNameWithAffix}}[[는]] {{sourcePokemonName}}에게\n{{moveName}}[[를]] 당했다!",
  "battlerTagsWrapOnTrap": "{{pokemonNameWithAffix}}[[는]] {{sourcePokemonName}}에게\n휘감겼다!",
  "battlerTagsVortexOnTrap": "{{pokemonNameWithAffix}}[[는]]\n소용돌이 속에 갇혔다!",
  "battlerTagsClampOnTrap": "{{sourcePokemonNameWithAffix}}[[는]] {{pokemonName}}의\n껍질에 꼈다!",
  "battlerTagsSandTombOnTrap": "{{pokemonNameWithAffix}}[[는]]\n{{moveName}}에 붙잡혔다!",
  "battlerTagsMagmaStormOnTrap": "{{pokemonNameWithAffix}}[[는]]\n마그마의 소용돌이에 갇혔다!",
  "battlerTagsSnapTrapOnTrap": "{{pokemonNameWithAffix}}[[는]]\n집게덫에 붙잡혔다!",
  "battlerTagsThunderCageOnTrap": "{{sourcePokemonNameWithAffix}}[[는]]\n{{pokemonNameWithAffix}}를 가두었다!",
  "battlerTagsInfestationOnTrap": "{{pokemonNameWithAffix}}[[는]]\n{{sourcePokemonNameWithAffix}}에게 엉겨 붙었다!",
  "battlerTagsProtectedOnAdd": "{{pokemonNameWithAffix}}[[는]]\n방어 태세에 들어갔다!",
  "battlerTagsProtectedLapse": "{{pokemonNameWithAffix}}[[는]]\n공격으로부터 몸을 지켰다!",
  "battlerTagsEnduringOnAdd": "{{pokemonNameWithAffix}}[[는]]\n버티기 태세에 들어갔다!",
  "battlerTagsEnduringLapse": "{{pokemonNameWithAffix}}[[는]]\n공격을 버텼다!",
  "battlerTagsSturdyLapse": "{{pokemonNameWithAffix}}[[는]]\n공격을 버텼다!",
  "battlerTagsPerishSongLapse": "{{pokemonNameWithAffix}}의 멸망의\n카운트가 {{turnCount}}[[가]] 되었다!",
  "battlerTagsTruantLapse": "{{pokemonNameWithAffix}}[[는]] 게으름을 피우고 있다!",
  "battlerTagsSlowStartOnAdd": "{{pokemonNameWithAffix}}[[는]] 컨디션이\n좋아지지 않는다!",
  "battlerTagsSlowStartOnRemove": "{{pokemonNameWithAffix}} 는 마침내\n컨디션을 회복했다!",
  "battlerTagsHighestStatBoostOnAdd": "{{pokemonNameWithAffix}}의\n{{statName}}[[가]] 올라갔다!",
  "battlerTagsHighestStatBoostOnRemove": "The effects of {{pokemonNameWithAffix}}'s\n{{abilityName}} wore off!",
  "battlerTagsCritBoostOnAdd": "{{pokemonNameWithAffix}}[[는]]\n의욕이 넘치고 있다!",
  "battlerTagsCritBoostOnRemove": "{{pokemonNameWithAffix}}[[는]] 평소로 돌아왔다.",
  "battlerTagsSaltCuredOnAdd": "{{pokemonNameWithAffix}}[[는]]\n소금에 절여졌다!",
  "battlerTagsSaltCuredLapse": "{{pokemonNameWithAffix}}[[는]] 소금절이의\n데미지를 입고 있다.",
  "battlerTagsCursedOnAdd": "{{pokemonNameWithAffix}}[[는]]\n자신의 체력을 깎아서\n{{pokemonName}}에게 저주를 걸었다!",
  "battlerTagsCursedLapse": "{{pokemonNameWithAffix}}[[는]]\n저주받고 있다!",
} as const;
