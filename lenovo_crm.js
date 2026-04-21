const navConfig = {
  dashboard:      { title: 'Дашборд',       btn: '+ Новий звіт',    modal: 'report' },
  orders:         { title: 'Замовлення',     btn: '+ Замовлення',    modal: 'order' },
  service:        { title: 'Сервіс',         btn: '+ Заявка',        modal: 'repair' },
  contragents:    { title: 'Контрагенти',    btn: '+ Контрагент',    modal: 'contragent-phys' },
  communications: { title: 'Комунікації',   btn: '+ Звернення',     modal: 'comm' },
  tasks:          { title: 'Задачі',         btn: '+ Задача',        modal: 'task' },
  learning:       { title: 'Навч. центр',    btn: 'Мій прогрес',    modal: 'progress' }
};

function navigate(id) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const keys = Object.keys(navConfig);
  document.querySelectorAll('.nav-item')[keys.indexOf(id)].classList.add('active');
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('section-' + id).classList.add('active');
  const cfg = navConfig[id];
  document.getElementById('page-title').textContent = cfg.title;
  const btn = document.getElementById('main-action-btn');
  btn.textContent = cfg.btn;
  btn.onclick = () => openModal(cfg.modal);
}

function switchServiceTab(tab, el) {
  document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.service-tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById('stab-' + tab).classList.add('active');
}

function switchContragentTab(type) {
  const isPhys = type === 'phys';
  document.getElementById('ctab-phys').classList.toggle('active', isPhys);
  document.getElementById('ctab-legal').classList.toggle('active', !isPhys);
  document.getElementById('ctab-phys-content').style.display = isPhys ? 'block' : 'none';
  document.getElementById('ctab-legal-content').style.display = isPhys ? 'none' : 'block';
  document.getElementById('contragent-add-btn').textContent = isPhys ? '+ Додати ФО' : '+ Додати ЮО';
  document.getElementById('contragent-add-btn').onclick = () => openModal(isPhys ? 'contragent-phys' : 'contragent-legal');
}

function selectPayment(el) {
  document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  showNotif('Спосіб оплати: ' + el.querySelector('.payment-label').textContent);
}

let notifTimer;
function showNotif(msg) {
  const el = document.getElementById('notification');
  el.innerHTML = '<strong>✓</strong> ' + msg;
  el.classList.add('show');
  clearTimeout(notifTimer);
  notifTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

const modalTemplates = {
  order: {
    title: 'Нове замовлення',
    body: `
      <div class="form-row"><div class="form-group"><label class="form-label">Клієнт</label><input class="form-input" placeholder="ПІБ або назва компанії"/></div><div class="form-group"><label class="form-label">Телефон</label><input class="form-input" placeholder="+380..."/></div></div>
      <div class="form-group"><label class="form-label">Продукт</label><select class="form-select"><option>ThinkPad X1 Carbon Gen 12</option><option>IdeaPad Slim 5</option><option>Legion 5 Pro</option><option>Yoga 9i</option><option>Tab P12 Pro</option><option>ThinkBook 14 Gen 6</option></select></div>
      <div class="form-row"><div class="form-group"><label class="form-label">Кількість</label><input class="form-input" type="number" value="1" min="1"/></div><div class="form-group"><label class="form-label">Сума</label><input class="form-input" placeholder="₴"/></div></div>
      <div class="form-group"><label class="form-label">Спосіб оплати</label><select class="form-select"><option>Банківська карта</option><option>Рахунок (юр. особа)</option><option>Розстрочка</option><option>Apple/Google Pay</option><option>Накладений платіж</option><option>Готівка</option></select></div>
      <div class="form-group"><label class="form-label">Коментар</label><textarea class="form-textarea" placeholder="Додаткова інформація..."></textarea></div>`
  },
  exchange: {
    title: 'Заявка на обмін / повернення',
    body: `
      <div class="form-group"><label class="form-label">Клієнт</label><input class="form-input" placeholder="ПІБ клієнта"/></div>
      <div class="form-row"><div class="form-group"><label class="form-label">№ Замовлення</label><input class="form-input" placeholder="#ORD-..."/></div><div class="form-group"><label class="form-label">Тип</label><select class="form-select"><option>Обмін</option><option>Повернення</option></select></div></div>
      <div class="form-group"><label class="form-label">Товар</label><input class="form-input" placeholder="Назва товару"/></div>
      <div class="form-group"><label class="form-label">Причина</label><select class="form-select"><option>Дефект / несправність</option><option>Не підійшла модель</option><option>Механічне пошкодження</option><option>Неповна комплектація</option><option>Інше</option></select></div>
      <div class="form-group"><label class="form-label">Опис проблеми</label><textarea class="form-textarea" placeholder="Детальний опис..."></textarea></div>`
  },
  repair: {
    title: 'Нова заявка на ремонт',
    body: `
      <div class="form-group"><label class="form-label">Клієнт</label><input class="form-input" placeholder="ПІБ клієнта"/></div>
      <div class="form-row"><div class="form-group"><label class="form-label">Телефон</label><input class="form-input" placeholder="+380..."/></div><div class="form-group"><label class="form-label">Тип ремонту</label><select class="form-select"><option>Гарантійний</option><option>Платний</option></select></div></div>
      <div class="form-group"><label class="form-label">Пристрій</label><input class="form-input" placeholder="Модель пристрою"/></div>
      <div class="form-group"><label class="form-label">Серійний номер</label><input class="form-input" placeholder="S/N..."/></div>
      <div class="form-group"><label class="form-label">Несправність</label><textarea class="form-textarea" placeholder="Опис несправності..."></textarea></div>
      <div class="form-row"><div class="form-group"><label class="form-label">Майстер</label><select class="form-select"><option>Іванов М.</option><option>Мороз В.</option><option>Коваль О.</option></select></div><div class="form-group"><label class="form-label">Термін (дні)</label><input class="form-input" type="number" value="7"/></div></div>`
  },
  writeoff: {
    title: 'Новий акт на списання',
    body: `
      <div class="form-row"><div class="form-group"><label class="form-label">№ Акту</label><input class="form-input" placeholder="СП-2026-..."/></div><div class="form-group"><label class="form-label">Дата</label><input class="form-input" type="date" value="2026-04-21"/></div></div>
      <div class="form-group"><label class="form-label">Підстава</label><input class="form-input" placeholder="Наказ №... від ..."/></div>
      <div class="form-group"><label class="form-label">Голова комісії</label><select class="form-select"><option>Іванов М.О.</option><option>Петренко С.В.</option><option>Мороз В.Г.</option></select></div>
      <div class="form-group"><label class="form-label">Перелік товарів (по рядках)</label><textarea class="form-textarea" style="height:90px" placeholder="ThinkPad T580, інв. ЛН-0421, 1 шт., 0 ₴&#10;Монітор ThinkVision, інв. ЛН-0389, 2 шт., 0 ₴"></textarea></div>
      <div class="form-group"><label class="form-label">Причина</label><select class="form-select"><option>Моральний та фізичний знос</option><option>Непоправна несправність</option><option>Механічне пошкодження</option><option>Втрата</option></select></div>`
  },
  'contragent-phys': {
    title: 'Нова фізична особа',
    body: `
      <div class="form-row"><div class="form-group"><label class="form-label">Прізвище</label><input class="form-input" placeholder="Прізвище"/></div><div class="form-group"><label class="form-label">Ім'я</label><input class="form-input" placeholder="Ім'я"/></div></div>
      <div class="form-group"><label class="form-label">По батькові</label><input class="form-input" placeholder="По батькові"/></div>
      <div class="form-row"><div class="form-group"><label class="form-label">Телефон</label><input class="form-input" placeholder="+380..."/></div><div class="form-group"><label class="form-label">Email</label><input class="form-input" placeholder="email@..."/></div></div>
      <div class="form-row"><div class="form-group"><label class="form-label">ІПН</label><input class="form-input" placeholder="10 цифр"/></div><div class="form-group"><label class="form-label">Паспорт</label><input class="form-input" placeholder="АА 123456"/></div></div>
      <div class="form-group"><label class="form-label">Адреса</label><input class="form-input" placeholder="Місто, вулиця, будинок"/></div>
      <div class="form-group"><label class="form-label">Категорія</label><select class="form-select"><option>Звичайний клієнт</option><option>VIP</option><option>Корпоративний</option></select></div>`
  },
  'contragent-legal': {
    title: 'Нова юридична особа',
    body: `
      <div class="form-group"><label class="form-label">Повна назва</label><input class="form-input" placeholder="ТОВ «Назва компанії»"/></div>
      <div class="form-row"><div class="form-group"><label class="form-label">Форма</label><select class="form-select"><option>ТОВ</option><option>ФОП</option><option>АТ</option><option>ПП</option><option>ДП</option></select></div><div class="form-group"><label class="form-label">ЄДРПОУ</label><input class="form-input" placeholder="8 цифр"/></div></div>
      <div class="form-row"><div class="form-group"><label class="form-label">ІПН</label><input class="form-input" placeholder="12 цифр"/></div><div class="form-group"><label class="form-label">ПДВ</label><select class="form-select"><option>Платник ПДВ</option><option>Не платник ПДВ</option></select></div></div>
      <div class="form-row"><div class="form-group"><label class="form-label">Телефон</label><input class="form-input" placeholder="+380..."/></div><div class="form-group"><label class="form-label">Email</label><input class="form-input" placeholder="email@company.ua"/></div></div>
      <div class="form-group"><label class="form-label">IBAN</label><input class="form-input" placeholder="UA..."/></div>
      <div class="form-row"><div class="form-group"><label class="form-label">Директор</label><input class="form-input" placeholder="ПІБ"/></div><div class="form-group"><label class="form-label">Бухгалтер</label><input class="form-input" placeholder="ПІБ"/></div></div>
      <div class="form-group"><label class="form-label">Юридична адреса</label><input class="form-input" placeholder="Місто, вулиця, будинок"/></div>`
  },
  'view-phys': {
    title: 'Картка клієнта — Гриценко Анна',
    body: `
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--border)">
        <div style="width:56px;height:56px;border-radius:50%;background:#fdecea;color:#c62828;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;flex-shrink:0">ГА</div>
        <div><div style="font-size:16px;font-weight:700">Гриценко Анна Василівна</div><div style="font-size:12px;color:var(--text-sec);margin-top:2px">Клієнт з 2024 року · VIP</div></div>
      </div>
      <div style="font-size:13px;line-height:2;color:var(--text-sec)">
        📞 +380 67 123-45-67<br>✉️ a.grytsenko@gmail.com<br>📍 Київ, вул. Хрещатик 22<br>ІПН: 2847651039 · Паспорт: АА 123456
      </div>
      <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border)">
        <div style="font-size:12px;font-weight:600;color:var(--text-sec);margin-bottom:8px">ЗАМОВЛЕННЯ</div>
        <table><thead><tr><th>№</th><th>Товар</th><th>Сума</th><th>Статус</th></tr></thead><tbody>
        <tr><td>#ORD-4821</td><td>ThinkPad X1</td><td>62 400 ₴</td><td><span class="badge badge-blue">В обробці</span></td></tr>
        <tr><td>#ORD-4712</td><td>IdeaPad 5</td><td>34 200 ₴</td><td><span class="badge badge-green">Виконано</span></td></tr>
        </tbody></table>
      </div>`
  },
  'view-legal': {
    title: 'Картка контрагента — ТОВ «Технологія Офіс»',
    body: `
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--border)">
        <div style="width:56px;height:56px;border-radius:12px;background:#f3e5f5;color:#6a1b9a;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;flex-shrink:0">ТО</div>
        <div><div style="font-size:16px;font-weight:700">ТОВ «Технологія Офіс»</div><div style="font-size:12px;color:var(--text-sec);margin-top:2px">Корпоративний клієнт · VIP партнер</div></div>
      </div>
      <div style="font-size:13px;line-height:2;color:var(--text-sec)">
        ЄДРПОУ: 32145678 · ІПН: 321456789012<br>📞 +380 44 234-56-78 · ✉️ purchase@techoffice.ua<br>📍 Київ, вул. Велика Васильківська 72<br>Директор: Ткаченко Д.В. · р/р: UA71305299000002600631...
      </div>
      <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border)">
        <div style="display:flex;gap:8px">
          <button class="btn btn-sm" onclick="showNotif('Акт звірки сформовано');closeModal()">📄 Акт звірки</button>
          <button class="btn btn-sm btn-primary" onclick="showNotif('Рахунок сформовано');closeModal()">💳 Виставити рахунок</button>
          <button class="btn btn-sm" onclick="showNotif('Договір відкрито');closeModal()">📋 Договір</button>
        </div>
      </div>`
  },
  refundact: {
    title: 'Акт повернення товару',
    body: `
      <div class="form-row"><div class="form-group"><label class="form-label">№ Акту</label><input class="form-input" placeholder="АП-2026-..."/></div><div class="form-group"><label class="form-label">Дата</label><input class="form-input" type="date" value="2026-04-21"/></div></div>
      <div class="form-group"><label class="form-label">Клієнт</label><input class="form-input" value="Марченко Г.В."/></div>
      <div class="form-group"><label class="form-label">Товар</label><input class="form-input" value="IdeaPad 5 Pro 16"/></div>
      <div class="form-row"><div class="form-group"><label class="form-label">Сума повернення</label><input class="form-input" placeholder="₴"/></div><div class="form-group"><label class="form-label">Спосіб повернення</label><select class="form-select"><option>На карту</option><option>Готівка</option><option>IBAN</option></select></div></div>
      <div class="form-group"><label class="form-label">Причина повернення</label><textarea class="form-textarea" placeholder="Не підійшла модель..."></textarea></div>`
  }
};

function openModal(type) {
  const tpl = modalTemplates[type] || { title: 'Дія', body: '<p>Форма недоступна</p>' };
  document.getElementById('modal-title-text').textContent = tpl.title;
  document.getElementById('modal-body').innerHTML = tpl.body;
  document.getElementById('modal-overlay').classList.add('show');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('show');
}

function submitModal() {
  closeModal();
  showNotif('Збережено успішно');
}

function toggleTask(el) {
  el.classList.toggle('done');
  const title = el.parentElement.querySelector('.task-title');
  if (title) title.classList.toggle('done');
}

function addTask() {
  const list = document.getElementById('task-list');
  const item = document.createElement('div');
  item.className = 'task-item';
  item.innerHTML = `<div class="task-check" onclick="toggleTask(this)"></div><div class="task-body"><div class="task-title">Нова задача</div><div class="task-meta"><span>Сьогодні</span><span class="badge badge-gray" style="font-size:10px">Звичайне</span></div></div><button class="btn btn-sm" style="flex-shrink:0" onclick="this.closest('.task-item').remove();showNotif('Задачу видалено')">×</button>`;
  list.appendChild(item);
  showNotif('Нову задачу додано');
}
