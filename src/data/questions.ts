import type { Question, OralQuestion } from '@/types'

export const CATEGORIES = [
  '麻醉藥理學', '麻醉生理學', '麻醉設備與監測', '氣道管理',
  '麻醉技術與流程', '術前評估', '術中照護', '術後恢復照護',
  '急救與危急狀況處理', '麻醉併發症', '感染控制與病人安全', '法規倫理'
]

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'q001', category: '麻醉藥理學', subcategory: '靜脈麻醉藥',
    examType: '進階', examYear: 113, difficulty: 'medium', type: 'single',
    stem: '下列關於Propofol（異丙酚）的敘述，何者正確？',
    options: [
      { key: 'A', text: '具有明顯的鎮痛效果，可單獨用於術中止痛' },
      { key: 'B', text: '注射時常見疼痛感，主要因其油性溶劑特性' },
      { key: 'C', text: '給藥後心輸出量通常會增加' },
      { key: 'D', text: '代謝主要在腎臟進行' }
    ],
    correctAnswer: 'B',
    explanation: 'Propofol注射疼痛是臨床常見問題，主因其溶於大豆油乳劑中，刺激靜脈壁。可先給予Lidocaine 0.5mg/kg預防。Propofol本身無鎮痛效果；給藥後因血管擴張導致心輸出量降低；主要在肝臟代謝，腸外代謝也有貢獻。',
    keyPoint: 'Propofol注射疼痛機轉與預防方法',
    commonTrap: '容易誤以為有鎮痛效果，或認為代謝在腎臟',
    tags: ['propofol', '靜脈麻醉', '注射疼痛'], source: '113年進階試題', isActive: true
  },
  {
    id: 'q002', category: '麻醉藥理學', subcategory: '吸入麻醉藥',
    examType: '進階', examYear: 113, difficulty: 'medium', type: 'single',
    stem: '惡性高熱（Malignant Hyperthermia）的第一線治療藥物為何？',
    options: [
      { key: 'A', text: 'Succinylcholine' },
      { key: 'B', text: 'Dantrolene' },
      { key: 'C', text: 'Diazepam' },
      { key: 'D', text: 'Propranolol' }
    ],
    correctAnswer: 'B',
    explanation: 'Dantrolene是惡性高熱唯一有效的治療藥物，機轉為阻斷肌漿網狀內皮系統的鈣離子釋放，劑量為2.5mg/kg IV快速給予，可重複至10mg/kg。Succinylcholine反而是誘發惡性高熱的觸發藥物之一。',
    keyPoint: '惡性高熱診斷三要素（體溫升高、肌肉僵硬、高碳酸血症）與Dantrolene治療',
    commonTrap: '惡性高熱與Succinylcholine的關係——Succinylcholine是誘因不是治療',
    tags: ['惡性高熱', 'dantrolene', '急救'], source: '113年進階試題', isActive: true
  },
  {
    id: 'q003', category: '氣道管理', subcategory: '插管技術',
    examType: '進階', examYear: 112, difficulty: 'hard', type: 'single',
    stem: '使用Cormack-Lehane分級評估喉鏡視野，第三級（Grade III）表示：',
    options: [
      { key: 'A', text: '可見聲門全部' },
      { key: 'B', text: '可見聲門後半部' },
      { key: 'C', text: '僅見會厭' },
      { key: 'D', text: '完全無法見到會厭' }
    ],
    correctAnswer: 'C',
    explanation: 'Cormack-Lehane分級：Grade I=聲門全可見；Grade II=僅见聲門後半部或杓狀軟骨；Grade III=僅見會厭（epiglottis only）；Grade IV=連會厭都看不到。Grade III-IV屬困難插管，需備用計畫（video laryngoscope、LMA等）。',
    keyPoint: 'CL分級系統各級特徵，Grade III是考試常考點',
    tags: ['困難插管', '喉鏡', 'Cormack-Lehane'], source: '112年進階試題', isActive: true
  },
  {
    id: 'q004', category: '術中照護', subcategory: '低血壓處理',
    examType: '通論', examYear: 113, difficulty: 'medium', type: 'single',
    stem: '術中發生低血壓（收縮壓<90 mmHg），下列處置順序何者最正確？',
    options: [
      { key: 'A', text: '立即給予升壓藥物（Ephedrine）' },
      { key: 'B', text: '先評估原因（出血、麻醉過深、過敏等），再對症處理' },
      { key: 'C', text: '立即增加麻醉濃度確保病人無感覺' },
      { key: 'D', text: '立即輸血補充血容' }
    ],
    correctAnswer: 'B',
    explanation: '術中低血壓處理原則：先找原因再治療。原因包括：(1)麻醉過深→降低麻醉藥；(2)出血/低血容→輸液/輸血；(3)過敏反應→Epinephrine；(4)心臟問題→對症。盲目給升壓藥或增加麻醉深度都不是正確首要步驟。',
    keyPoint: '術中低血壓的鑑別診斷與分步處理原則（ABCDE評估）',
    tags: ['低血壓', '術中照護', '血壓管理'], source: '113年通論試題', isActive: true
  },
  {
    id: 'q005', category: '麻醉設備與監測', subcategory: '監測儀器',
    examType: '通論', examYear: 112, difficulty: 'easy', type: 'single',
    stem: '脈搏血氧計（Pulse Oximeter）主要監測下列何項指標？',
    options: [
      { key: 'A', text: 'PaO₂（動脈血氧分壓）' },
      { key: 'B', text: 'SpO₂（血氧飽和度）' },
      { key: 'C', text: 'SvO₂（混合靜脈血氧飽和度）' },
      { key: 'D', text: 'FiO₂（吸入氧濃度）' }
    ],
    correctAnswer: 'B',
    explanation: 'Pulse Oximeter測量的是SpO₂（peripheral oxygen saturation），利用不同波長光線（660nm紅光、940nm紅外光）計算氧合血紅素比例。注意：SpO₂正常不等於PaO₂正常——在氧解離曲線平台期，PaO₂可能已下降但SpO₂仍維持正常範圍。',
    keyPoint: 'SpO₂ vs PaO₂的差異，氧解離曲線臨床意義',
    tags: ['SpO₂', '監測', '血氧'], source: '112年通論試題', isActive: true
  },
  {
    id: 'q006', category: '術前評估', subcategory: 'ASA分級',
    examType: '通論', examYear: 111, difficulty: 'easy', type: 'single',
    stem: '依據ASA身體狀況分級，一位有控制良好的高血壓病人（血壓130/85 mmHg，規律服藥）應分為？',
    options: [
      { key: 'A', text: 'ASA I' },
      { key: 'B', text: 'ASA II' },
      { key: 'C', text: 'ASA III' },
      { key: 'D', text: 'ASA IV' }
    ],
    correctAnswer: 'B',
    explanation: 'ASA分級：I=正常健康；II=有輕度全身性疾病（控制良好的高血壓、糖尿病、BMI<40、輕度肺病）；III=嚴重全身性疾病（未控制DM、有症狀COPD、病態性肥胖）；IV=危及生命的嚴重疾病；V=瀕死病人。控制良好的高血壓屬ASA II。',
    keyPoint: 'ASA分級各級標準與常見例子',
    tags: ['ASA分級', '術前評估'], source: '111年通論試題', isActive: true
  },
  {
    id: 'q007', category: '急救與危急狀況處理', subcategory: '過敏反應',
    examType: '進階', examYear: 112, difficulty: 'hard', type: 'single',
    stem: '術中發生嚴重過敏反應（Anaphylaxis），第一線藥物與首選劑量為？',
    options: [
      { key: 'A', text: 'Diphenhydramine 50mg IV' },
      { key: 'B', text: 'Hydrocortisone 200mg IV' },
      { key: 'C', text: 'Epinephrine 0.1mg（1:10000）IV' },
      { key: 'D', text: 'Norepinephrine 0.1mcg/kg/min持續輸注' }
    ],
    correctAnswer: 'C',
    explanation: 'Anaphylaxis第一線治療：Epinephrine是唯一可以同時對抗過敏反應多重病理機轉的藥物（支氣管擴張、升壓、減少組織胺釋放）。術中靜脈給予1:10000濃度（0.1mg=1ml），可每5-10分鐘重複。抗組織胺和類固醇是第二線輔助治療，不能取代Epinephrine。',
    keyPoint: 'Anaphylaxis：Epinephrine優先，三角治療記憶法（E-A-S：Epi、抗組織胺、Steroid）',
    tags: ['過敏反應', 'Epinephrine', '急救'], source: '112年進階試題', isActive: true
  },
  {
    id: 'q008', category: '麻醉生理學', subcategory: '呼吸生理',
    examType: '通論', examYear: 110, difficulty: 'medium', type: 'single',
    stem: '下列何者為正常成人在靜止狀態下的潮氣量（Tidal Volume）？',
    options: [
      { key: 'A', text: '150-200 mL' },
      { key: 'B', text: '500-600 mL' },
      { key: 'C', text: '1000-1200 mL' },
      { key: 'D', text: '3000-4000 mL' }
    ],
    correctAnswer: 'B',
    explanation: '正常成人呼吸參數：潮氣量（TV）= 500-600 mL（約7-8 mL/kg）；呼吸次數=12-16次/分；分鐘通氣量=TV×RR≈6-8 L/min；死腔（Dead space）≈150 mL（約解剖死腔）。機械通氣時建議TV=6-8 mL/kg理想體重（肺保護策略）。',
    keyPoint: '正常呼吸參數記憶：TV 500mL、RR 12-16、MV 6-8L/min',
    tags: ['潮氣量', '呼吸生理', '機械通氣'], source: '110年通論試題', isActive: true
  },
  {
    id: 'q009', category: '術後恢復照護', subcategory: 'PACU監測',
    examType: '通論', examYear: 113, difficulty: 'medium', type: 'single',
    stem: '病人術後在恢復室（PACU）出現寒顫（Shivering），最適當的初步處置為？',
    options: [
      { key: 'A', text: '立即給予Meperidine 12.5-25mg IV' },
      { key: 'B', text: '先予保暖措施（加蓋毯子、調高室溫），評估體溫' },
      { key: 'C', text: '立即再次誘導麻醉抑制寒顫' },
      { key: 'D', text: '忽略，寒顫為正常術後現象不需處理' }
    ],
    correctAnswer: 'B',
    explanation: '術後寒顫（Post-anesthetic shivering）常見原因：低體溫、揮發性麻醉藥殘留、阿片類藥物戒斷。初步處置：(1)加蓋保暖毯或強制熱風毯；(2)測量體溫；(3)評估是否有其他原因。若保暖無效，Meperidine 12.5-25mg IV是有效的藥物選擇，但應先嘗試非藥物方法。',
    keyPoint: '術後寒顫：先保暖非藥物處置，無效再用Meperidine',
    tags: ['寒顫', 'PACU', '術後照護'], source: '113年通論試題', isActive: true
  },
  {
    id: 'q010', category: '麻醉藥理學', subcategory: '肌肉鬆弛劑',
    examType: '進階', examYear: 111, difficulty: 'medium', type: 'single',
    stem: 'Succinylcholine（去極化型肌肉鬆弛劑）相較於非去極化型，最主要的臨床優勢為？',
    options: [
      { key: 'A', text: '無任何副作用，安全性最高' },
      { key: 'B', text: '作用持續時間最長，適合長手術' },
      { key: 'C', text: '起效極快（60秒內）且持續時間短，適合快速插管' },
      { key: 'D', text: '可被Neostigmine完全拮抗' }
    ],
    correctAnswer: 'C',
    explanation: 'Succinylcholine最大優點是起效快（30-60秒，適合RSI快速插管）且持續時間短（10-15分鐘）。缺點包括：(1)高血鉀風險（燒傷、截癱、長期臥床者禁用）；(2)可能誘發惡性高熱；(3)心律不整；(4)不能被Neostigmine拮抗。非去極化型才能用Neostigmine/Sugammadex拮抗。',
    keyPoint: 'Succinylcholine：RSI首選但禁忌症多；Rocuronium+Sugammadex可替代',
    tags: ['Succinylcholine', '肌肉鬆弛劑', 'RSI', '快速插管'], source: '111年進階試題', isActive: true
  },
  {
    id: 'q011', category: '麻醉設備與監測', subcategory: 'BIS監測',
    examType: '進階', examYear: 110, difficulty: 'hard', type: 'single',
    stem: 'Bispectral Index（BIS）監測目的為何？BIS值在何範圍為適當麻醉深度？',
    options: [
      { key: 'A', text: '監測疼痛程度；BIS 0-20' },
      { key: 'B', text: '監測麻醉深度（意識程度）；BIS 40-60' },
      { key: 'C', text: '監測肌肉張力；BIS 60-80' },
      { key: 'D', text: '監測腦血流量；BIS 80-100' }
    ],
    correctAnswer: 'B',
    explanation: 'BIS Monitor監測大腦電氣活動（EEG衍生），反映意識/麻醉深度：100=完全清醒；80-100=輕度鎮靜；60-80=淺麻醉（可能有術中知曉）；40-60=適當全麻深度；<40=過深麻醉；0=等電位（腦死）。BIS 40-60是全麻手術目標範圍。',
    keyPoint: 'BIS 40-60為全麻目標，<60減少術中知曉風險',
    tags: ['BIS', '麻醉深度', '術中知曉'], source: '110年進階試題', isActive: true
  },
  {
    id: 'q012', category: '法規倫理', subcategory: '知情同意',
    examType: '通論', examYear: 109, difficulty: 'easy', type: 'single',
    stem: '術前麻醉知情同意書（Informed Consent）應由誰完成說明並簽署？',
    options: [
      { key: 'A', text: '手術室護理師' },
      { key: 'B', text: '病房護理師' },
      { key: 'C', text: '負責麻醉的醫師（麻醉科醫師）' },
      { key: 'D', text: '外科主刀醫師' }
    ],
    correctAnswer: 'C',
    explanation: '麻醉知情同意應由麻醉科醫師在術前訪視時向病人說明，內容包括：麻醉方式、可能風險與併發症、替代方案、術後疼痛控制計畫。麻醉專科護理師可協助說明及準備文件，但法律上負責簽署說明的是麻醉科醫師。',
    keyPoint: '麻醉知情同意：由麻醉科醫師負責；護理師協助但不主責',
    tags: ['知情同意', '法規', '麻醉倫理'], source: '109年通論試題', isActive: true
  },
]

export const ORAL_QUESTIONS: OralQuestion[] = [
  {
    id: 'oral001',
    category: '氣道管理',
    topic: '困難插管處理',
    scenario: '一位58歲男性病人，頸部粗短，張口度約2指，甲頦距離3cm，Mallampati分級III級，預計接受腹部手術全身麻醉。',
    mainQuestion: '面對這位病人，你在插管前會如何評估困難插管風險？並說明你的插管計畫。',
    followUp1: '如果第一次喉鏡插管失敗，你的備用計畫是什麼？',
    followUp2: '病人發生"Can\'t Intubate, Can\'t Oxygenate"（CICO）情況時，你會怎麼做？',
    scoringPoints: [
      '困難插管風險評估工具（LEMON法則）',
      '喚醒插管選項（清醒纖維支氣管鏡插管）',
      'Failed Airway流程熟悉度',
      'CICO緊急環甲膜切開術認知',
      '病人安全意識'
    ],
    modelAnswer: '評估方面使用LEMON法則（Look、Evaluate、Mallampati、Obstruction、Neck）。此病人Mallampati III、甲頦距離<6cm屬高風險。計畫：優先考慮清醒纖維支氣管鏡插管（awake FOI），準備Video Laryngoscope作备用，備好LMA、環甲膜切開套組。若插管失敗，執行3-2-1原則，CICO時立即外科環甲膜切開術。',
    keywords: ['困難插管', 'LEMON', 'CICO', '環甲膜切開', '纖維支氣管鏡'],
    source: 'NTUH台大口試題庫'
  },
  {
    id: 'oral002',
    category: '急救處理',
    topic: '惡性高熱辨識與處置',
    scenario: '一位20歲女性接受扁桃腺切除術，使用Sevoflurane + Succinylcholine誘導後10分鐘，SpO₂開始下降至92%，ETCO₂急速上升至65mmHg，體溫38.8°C且快速上升，肌肉僵硬。',
    mainQuestion: '你懷疑這位病人可能發生什麼狀況？說明你的判斷依據和立即處置。',
    followUp1: '你會給予什麼特定治療藥物？劑量是多少？',
    followUp2: '惡性高熱的預後如何？術後需要注意什麼？',
    scoringPoints: [
      '惡性高熱診斷三要素識別',
      'Dantrolene劑量正確（2.5mg/kg，可重複至10mg/kg）',
      '立即停止誘發藥物',
      '支持性治療（降溫、ICU轉送）',
      '家族遺傳諮詢建議'
    ],
    modelAnswer: '診斷：惡性高熱（MH）。依據：Succinylcholine+Sevoflurane觸發，ETCO₂急升、體溫快速升高、肌肉僵硬三要素。立即處置：(1)停止所有觸發藥物，換純氧高流量通氣；(2)Dantrolene 2.5mg/kg IV快速給予，每5分鐘重複至症狀控制；(3)積極降溫（冰袋、冰生理食鹽水）；(4)血氣分析、電解質監測；(5)安排ICU。',
    keywords: ['惡性高熱', 'Dantrolene', 'ETCO₂', '肌肉僵硬'],
    source: 'NTUH台大口試題庫'
  },
  {
    id: 'oral003',
    category: '術中照護',
    topic: '脊椎麻醉後低血壓',
    scenario: '一位72歲女性進行髖關節置換術，接受脊椎麻醉（Spinal Anesthesia）後5分鐘，血壓從132/78 mmHg急降至80/50 mmHg，心跳68次/分，病人感覺頭暈。',
    mainQuestion: '請說明脊椎麻醉後低血壓的發生機轉，以及你的處置措施。',
    followUp1: '你會選擇哪種升壓藥？為什麼？',
    followUp2: '如何預防脊椎麻醉後低血壓？',
    scoringPoints: [
      '交感神經阻斷機轉理解',
      '輸液補充與體位調整',
      'Phenylephrine vs Ephedrine選擇理由',
      '老年人特殊考量',
      '預防措施（預先輸液、腿部抬高）'
    ],
    modelAnswer: '機轉：脊椎麻醉阻斷T4以上交感神經→周邊血管擴張→靜脈回流減少→心輸出量下降。立即處置：(1)頭低腳高（Trendelenburg）；(2)快速輸注晶體液250-500mL；(3)升壓藥選擇：此老年病人建議Phenylephrine（純α作用，不增加心率），若心跳<60則改Ephedrine。預防：術前預先輸液1000mL、左側傾斜15度（孕婦）。',
    keywords: ['脊椎麻醉', '低血壓', 'Phenylephrine', '交感神經'],
    source: 'NTUH台大口試題庫'
  },
]

export const ORAL_TOPICS = [
  { id: 'airway', name: '氣道管理', icon: '🫁', description: '困難插管、CICO、聲門上呼吸道' },
  { id: 'emergency', name: '急救與緊急處置', icon: '🚨', description: '惡性高熱、過敏、心停' },
  { id: 'intraop', name: '術中照護', icon: '🏥', description: '低血壓、低SpO₂、心律不整' },
  { id: 'preop', name: '術前評估', icon: '📋', description: 'ASA分級、困難氣道評估、用藥' },
  { id: 'regional', name: '區域麻醉', icon: '💉', description: '脊椎、硬膜外、局部麻醉毒性' },
  { id: 'pacu', name: '術後恢復照護', icon: '🛏️', description: 'PACU評估、PONV、疼痛管理' },
  { id: 'special', name: '特殊族群麻醉', icon: '👶', description: '小兒、老年、產科麻醉' },
  { id: 'ethics', name: '法規倫理', icon: '⚖️', description: '知情同意、病人安全、專科角色' },
]
