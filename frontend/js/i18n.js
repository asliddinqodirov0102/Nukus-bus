const translations = {
    kaa: {
        title: "Nókis Avtobus Monitoringi",
        header_title: "Nókis Trans",
        admin_panel: "Admin Panel",
        active_routes: "Aktiv jónelisler",
        live_status: "Janslı",
        speed: "Tezlik",
        next_station: "Keyingi azıqshılıq",
        eta: "Qalǵan waqıt",
        search_bus: "Avtobustı izlew...",
        dashboard: "Basqarıw Paneli",
        total_buses: "Ulıwma avtobuslar",
        active_now: "Házir aktiv",
        stations: "Ayaldamalar",
        daily_dist: "Kúnlik aralıq",
        login: "Kiriw",
        username: "Paydalanıwshı adı",
        password: "Parol",
        bus_number: "Avtobus no",
        route_name: "Jónelis adı",
        driver_phone: "Aydawshı tel",
        min: "min",
        km_h: "km/s",
        logout: "Shıǵıw",
        add_bus: "Avtobus qosıw",
        add_route: "Jónelis qosıw"
    },
    uz: {
        title: "Nukus Avtobus Monitoringi",
        header_title: "Nukus Trans",
        admin_panel: "Admin Panel",
        active_routes: "Faol Yo'nalishlar",
        live_status: "Jonli",
        speed: "Tezlik",
        next_station: "Keyingi bekat",
        eta: "Qolgan vaqt",
        search_bus: "Avtobusni izlash...",
        dashboard: "Boshqaruv Paneli",
        total_buses: "Jami avtobuslar",
        active_now: "Hozir tarmoqda",
        stations: "Bekatlar",
        daily_dist: "Kunlik masofa",
        login: "Tizimga kirish",
        username: "Foydalanuvchi nomi",
        password: "Parol",
        bus_number: "Avtobus raqami",
        route_name: "Yo'nalish nomi",
        driver_phone: "Haydovchi tel",
        min: "daq",
        km_h: "km/s",
        logout: "Chiqish",
        add_bus: "Avtobus qo'shish",
        add_route: "Yo'nalish qo'shish"
    },
    ru: {
        title: "Мониторинг Автобусов Нукуса",
        header_title: "Нукус Транс",
        admin_panel: "Админ. Панель",
        active_routes: "Активные маршруты",
        live_status: "Онлайн",
        speed: "Скорость",
        next_station: "Следующая",
        eta: "Ост. время",
        search_bus: "Поиск автобуса...",
        dashboard: "Панель Управления",
        total_buses: "Всего автобусов",
        active_now: "На линии",
        stations: "Остановки",
        daily_dist: "Дистанция",
        login: "Войти",
        username: "Имя пользователя",
        password: "Пароль",
        bus_number: "Номер авт.",
        route_name: "Маршрут",
        driver_phone: "Тел. водителя",
        min: "мин",
        km_h: "км/ч",
        logout: "Выйти",
        add_bus: "Новый автобус",
        add_route: "Новый маршрут"
    }
};

let currentLang = 'kaa';

function changeLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    
    // Update target elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (el.tagName === 'INPUT' && el.type === 'text') {
                el.placeholder = translations[lang][key];
            } else {
                el.innerText = translations[lang][key];
            }
        }
    });

    // Save language to localStorage
    localStorage.setItem('pref_lang', lang);

    // Give notification to other scripts
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
}

function getTranslation(key) {
    return translations[currentLang] && translations[currentLang][key] 
        ? translations[currentLang][key] 
        : key;
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('pref_lang') || 'kaa';
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = savedLang;
        langSelect.addEventListener('change', (e) => changeLanguage(e.target.value));
    }
    // Set initial layout translation
    changeLanguage(savedLang);
});
