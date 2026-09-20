const resources = [
  { title: "逗子市内の保育施設一覧", desc: "所在地・受入年齢・駐車場など", source: "逗子市", category: "childcare", icon: "baby", url: "https://www.city.zushi.kanagawa.jp/kosodate/egao/1002588/1002676/1002682/1002683/1002684.html" },
  { title: "藤沢市の認可保育施設一覧", desc: "認可保育所・認定こども園・小規模保育", source: "藤沢市", category: "childcare", icon: "baby", url: "https://www.city.fujisawa.kanagawa.jp/hoiku/kenko/kosodate/hoikuen/ninka-ichiran.html" },
  { title: "茅ヶ崎市の保育所等のしおり", desc: "認可保育所・認定こども園・地域型保育", source: "茅ヶ崎市", category: "childcare", icon: "baby", url: "https://www.city.chigasaki.kanagawa.jp/kosodate/1024751/hoikuen/1058018.html" },
  { title: "保活ワンポータル", desc: "全国の保育施設を地図から検索", source: "こども家庭庁", category: "childcare", icon: "map-pinned", url: "https://www.hokatsu-oneportal.cfa.go.jp/" },
  { title: "親子のフリースペース", desc: "支援センター・市内5か所のほっとスペース", source: "逗子市", category: "childcare", icon: "heart-handshake", url: "https://www.city.zushi.kanagawa.jp/kosodate/egao/1002588/1002996/1003000.html" },
  { title: "重ねるハザードマップ", desc: "津波・土砂・洪水などを地図で確認", source: "国土地理院", category: "safety", icon: "layers-3", url: "https://disaportal.gsi.go.jp/hazardmap/maps/index.html?ll=35.295,139.581&z=14&base=pale" },
  { title: "神奈川県災害情報ポータル", desc: "警報・避難情報・避難所の最新状況", source: "神奈川県", category: "safety", icon: "triangle-alert", url: "https://www.bousai.pref.kanagawa.jp/" },
  { title: "逗子市の公共施設案内", desc: "避難・子育て・文化・公園施設を地図から探す", source: "逗子市", category: "safety", icon: "building-2", url: "https://www.city.zushi.kanagawa.jp/shisei/1009287/sisetu/index.html" },
  { title: "小・中学校の入学・転校・学区", desc: "住所別学区と転入手続きを確認", source: "逗子市", category: "school", icon: "school", url: "https://www.city.zushi.kanagawa.jp/kosodate/gakkokyoiku/1003638/1003639/index.html" },
  { title: "子育て・教育施設", desc: "小中学校、学童、発達支援施設の一覧", source: "逗子市", category: "school", icon: "graduation-cap", url: "https://www.city.zushi.kanagawa.jp/shisei/1009287/sisetu/1007835/index.html" },
  { title: "市内医療機関の案内", desc: "病院・歯科・薬局・休日夜間診療", source: "逗子市", category: "health", icon: "hospital", url: "https://www.city.zushi.kanagawa.jp/kenkofukushi/iryo/1003995/1003996.html" },
  { title: "逗子への交通アクセス", desc: "JR・京急と主要駅からの所要時間", source: "逗子市", category: "life", icon: "train-front", url: "https://www.city.zushi.kanagawa.jp/shiminkatsudo/kanko/1004412/1004413.html" },
  { title: "ごみ・資源物の収集日", desc: "住所エリア別の曜日と年間カレンダー", source: "逗子市", category: "life", icon: "recycle", url: "https://www.city.zushi.kanagawa.jp/kurashi/gomirecycle/1002014/1002016.html" },
  { title: "逗子市の移住相談", desc: "オンライン相談と三浦半島コンシェルジュ", source: "逗子市", category: "life", icon: "messages-square", url: "https://www.city.zushi.kanagawa.jp/kurashi/ijuteiju/1009166/1009167.html" }
];

const checklist = [
  { title: "保育園候補を3園に絞る", detail: "園舎・避難先・通園経路を比較" },
  { title: "津波と土砂区域を確認", detail: "自宅候補地と園の両方を確認" },
  { title: "避難先まで歩いてみる", detail: "子ども連れの所要時間も計測" },
  { title: "小学校・中学校区を確認", detail: "住所別の指定校を確認" },
  { title: "小児科・休日診療を確認", detail: "距離と診療時間を確認" },
  { title: "駅・バス停まで歩いてみる", detail: "坂道と雨の日も想定" },
  { title: "買い物とごみ出しを確認", detail: "日常動線と収集地区を確認" },
  { title: "現地を朝・夜・雨天に見る", detail: "交通量・明るさ・排水を確認" }
];

const state = { category: "all", query: "" };
const checked = new Set(JSON.parse(localStorage.getItem("zushi-portal-checks") || "[]"));

const map = L.map("overviewMap", { zoomControl: false, scrollWheelZoom: false, attributionControl: true }).setView([35.295, 139.581], 13);
L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png", { maxZoom: 18, attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>' }).addTo(map);
L.control.zoom({ position: "bottomright" }).addTo(map);
L.marker([35.297006, 139.578768], { icon: L.divIcon({ className: "", html: '<div class="zushi-marker"></div>', iconSize: [24,24], iconAnchor: [12,12] }) }).addTo(map).bindTooltip("逗子駅", { permanent: true, direction: "top", offset: [0,-10] });

function renderResources() {
  const query = state.query.trim().toLowerCase();
  const visible = resources.filter(item => {
    const categoryMatch = state.category === "all" || item.category === state.category;
    const queryMatch = !query || `${item.title} ${item.desc} ${item.source}`.toLowerCase().includes(query);
    return categoryMatch && queryMatch;
  });
  document.getElementById("resourceList").innerHTML = visible.length ? visible.map(item => `
    <a class="resource-item" href="${item.url}" target="_blank" rel="noreferrer">
      <span class="resource-icon"><i data-lucide="${item.icon}"></i></span>
      <span class="resource-copy"><strong>${item.title}</strong><span>${item.desc}</span><span class="resource-source">${item.source}</span></span>
      <i data-lucide="arrow-up-right"></i>
    </a>`).join("") : '<div class="empty">該当する情報がありません</div>';
  lucide.createIcons();
}

function renderChecklist() {
  document.getElementById("checklistGrid").innerHTML = checklist.map((item, index) => `
    <label class="check-item ${checked.has(index) ? "done" : ""}">
      <input type="checkbox" data-check="${index}" ${checked.has(index) ? "checked" : ""} />
      <span><strong>${item.title}</strong><span>${item.detail}</span></span>
    </label>`).join("");
  const count = checked.size;
  document.getElementById("progressText").textContent = `${count} / ${checklist.length}`;
  document.getElementById("progressBar").style.width = `${count / checklist.length * 100}%`;
  document.querySelectorAll("[data-check]").forEach(input => input.addEventListener("change", () => {
    const index = Number(input.dataset.check);
    input.checked ? checked.add(index) : checked.delete(index);
    localStorage.setItem("zushi-portal-checks", JSON.stringify([...checked]));
    renderChecklist();
  }));
}

document.querySelectorAll("[data-category]").forEach(button => button.addEventListener("click", () => {
  state.category = button.dataset.category;
  document.querySelectorAll("[data-category]").forEach(item => item.classList.toggle("active", item === button));
  renderResources();
}));
document.getElementById("linkSearch").addEventListener("input", event => { state.query = event.target.value; renderResources(); });
document.getElementById("linkCount").textContent = resources.length;

renderResources();
renderChecklist();
lucide.createIcons();
