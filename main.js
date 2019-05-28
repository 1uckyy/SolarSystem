var pointLight, sun, moon, mercury, mercuryOrbit, venus, venusOrbit, earth, earthOrbit, mars, marsOrbit, jupiter, jupiterOrbit, saturn, saturnOrbit, saturnRing, uran, uranOrbit, uranRing, neptune, neptuneOrbit, controls, scene, camera, renderer, scene;
var raycaster, mouse = { x : 0, y : 0 };
const planetSegments = 48; //количество сегментов(треугольников)
//Земля
var earthData = constructPlanetData(365.2564, 0.01, 75, "earth", "img/earth.jpg", 5, planetSegments);
//Луна
var moonData = constructPlanetData(29.5, 0.01, 7, "moon", "img/moon.jpg", 1, planetSegments);
//Меркурий
var mercuryData = constructPlanetData(87.969, 0.008, 25, "mercury", "img/mercurymap.jpg", 2, planetSegments);
//Венера
var venusData = constructPlanetData(224.7, 0.003, 50, "venus", "img/venusmap.jpg", 4, planetSegments);
//Марс
var marsData = constructPlanetData(686.94, 0.0108, 112, "mars", "img/marsmap.jpg", 2.5, planetSegments);
//Юпитер
var jupiterData = constructPlanetData(4334.6, 0.022, 170, "jupiter", "img/jupitermap.jpg", 13, planetSegments);
//Сатурн
var saturnData = constructPlanetData(10835.3, 0.021, 220, "saturn", "img/saturnmap.jpg", 10, planetSegments);
//Уран
var uranData = constructPlanetData(30697.8, 0.021, 300, "uranus", "img/uranusmap.jpg", 7, planetSegments);
//Нептун
var neptuneData = constructPlanetData(60079, 0.017, 400, "neptune", "img/neptunemap.jpg", 7.5, planetSegments);
var orbitData = {value: 200, runOrbit: true, runRotation: true};

const dataArray = {
    'sun' : '<h2> Солнце </h2> <p> Солнце – это звезда, без которой не могло бы существовать жизни на Земле. Она дает нам энергию и тепло. Согласно классификации звезд, Солнце – желтый карлик. </p> <p> Возраст около 5 млрд. лет. <br> Имеет диаметр на экваторе равный 1 392 000 км, в 109 раз больше земного. <br> Период вращения на экваторе – 25,4 дня и 34 дня у полюсов. <br> Масса Солнца 2х10 в 27 степени тонн, примерно в 332950 раз больше массы Земли. <br> Температура внутри ядра примерно 15 млн градусов Цельсия. Температура на поверхности около 5500 градусов Цельсия. <br> По химическому составу Солнце состоит из 75% водорода, а из прочих 25% элементов больше всего гелия.</p>',

    'mercury' : '<h2> Меркурий </h2> <p>Это самая близкая к Солнцу планета, поэтому Солнце на Меркурий светит и греет в 7 раз сильнее, чем на Землю. На дневной стороне Меркурия страшно жарко, там вечное пекло. Измерения показывают, что температура там поднимается до 400 градусов выше нуля. Зато на ночной стороне должен быть всегда сильный мороз, который, вероятно, доходит до 200 градусов ниже нуля. </p> <h3>Энциклопедия</h3> <span><mark>Период обращения вокруг Солнца: 87,97 суток.</mark> <br> Диаметр на экваторе: 4878 км. <br> <mark>Период вращения (оборот вокруг оси): 58 дней.</mark> <br> Температура поверхности: 350 днем и –170 ночью. <br> <mark>Атмосфера: очень разреженная, гелий.</mark> <br> Сколько спутников: 0. <br> <mark>Главные спутники планеты: 0.</mark> </span>',

    'venus' : '<h2> Венера </h2> <p>Вторая планета от Солнца, имеет почти круговую орбиту. Она проходит к Земле ближе, чем какая-либо другая планета. Но плотная, облачная атмосфера не позволяет непосредственно видеть ее поверхность. Благодаря парниковому эффекту, температура поверхности разогревается до сотен градусов. Поверхность – раскаленная каменистая пустыня.</p> <h3>Энциклопедия</h3> <span><mark>Период обращения вокруг Солнца: 224,7 суток.</mark><br> Диаметр на экваторе: 12104 км. Период вращения (оборот вокруг оси): 243 дня.<br> <mark>Температура поверхности: 480 градусов (средняя).</mark><br> Атмосфера: плотная, в основном углекислый газ.<br> <mark>Сколько спутников: 0.</mark><br> Главные спутники планеты: 0.</span>',

    'earth' : ' <h2> Земля </h2> <p> Наша планета самая плотная из 8 планет Солнечной системы. Она также самая большая из четырёх планет Земной группы. </p> <h3>Поверхность</h3> <span>71% Земной поверхности покрыт океанами, оставшиеся 30% заняты семью континентами. Наружная поверхность Земли делится на несколько тектонических плит, которые медленно передвигаются по поверхности в течении миллионов лет.</span> <h3>Энциклопедия</h3> <span><mark>Период обращения вокруг Солнца: 365,3 суток.</mark> <br> Диаметр на экваторе: 12756 км. <br> <mark>Период вращения планеты (оборот вокруг оси): 23 часа 56 мин</mark>. <br> Температура поверхности: 22 градуса (средняя). <br> <mark>Атмосфера: в основном азот и кислород.</mark> <br> Число спутников: 1. <br><mark> Главные спутники планеты: Луна.</mark></span>',

    'mars' : ' <h2> Марс </h2> <p>Марс это четвертая планета от Солнца и вторая самая маленькая планета Солнечной системы. Красноватая окраска поверхности Марса обусловлена присутствием оксида железа(ржавчины).</p> <h3>Поверхность</h3> <span>Марс имеет необычный пейзаж: конусные вулканы и огромные системы каньонов. Из всех планет Солнечной системы, на Марсе самая высокая гора - Олимп и самый большой каньон - Долина Маринера.</span> <h3>Энциклопедия</h3> <span><mark>Период обращения вокруг Солнца: 687 суток.</mark><br> Диаметр планеты на экваторе: 6794 км.<br><mark> Период вращения (оборот вокруг оси): 24 часа 37 мин.</mark><br> Температура поверхности: –23 градуса (средняя). <br><mark>Атмосфера планеты: разреженная, в основном углекислый газ.<br></mark> Сколько спутников: 2. <mark><br>Главные спутники по порядку: Фобос, Деймос.</mark></span> ',

    'jupiter' : ' <h2> Юпитер  </h2>  <p>Юпитер - самая большая планета Солнечной системы, с массой в 2,5 раза большей, чем у всех остальных вместе взятых планет, и составляющая всего 0,001% массы Солнца.</p>   <h3>Энциклопедия</h3> <span><mark>Период обращения вокруг Солнца: 11 лет 314 суток.</mark><br> Диаметр планеты на экваторе: 143884 км.<br><mark>Период вращения (оборот вокруг оси): 9 часов 55 мин.</mark><br>Температура поверхности планеты: –150 градусов (средняя).<br><mark>Атмосфера: в основном водород и гелий.</mark><br>Число спутников: 16 (+ кольца).<br><mark>Главные спутники планет по порядку: Ио, Европа, Ганимед, Каллисто.</mark></span>',

    'saturn' : ' <h2> Сатурн </h2>  <p>Сатурн это шестая планета от Солнца и вторая самая большая планета Солнечной системы. Вплоть до изобретения современного телескопа, Сатурн считали самой отдаленной из планет.</p>  <h3>Кольца</h3> <span>Кольца Сатурна самые большие и заметнее чем у других газовых гигантов. Кольца состоят из ледяных кристаллов воды и незначительного количества скальных пород, по размерам они варьируют от пылинок до частиц размером с гору.</span> <h3>Энциклопедия</h3> <span><mark>Период обращения вокруг Солнца: 29 лет 168 суток.</mark><br> Диаметр планеты на экваторе: 120536 км.<br><mark>Период вращения (оборот вокруг оси): 10 часов 14 мин.</mark><br>Температура поверхности: –180 градусов (средняя).<br><mark>Атмосфера: в основном водород и гелий. Число спутников: 18 (+ кольца).</mark><br>Главные спутники: Титан.</span>',

    'uranus' : ' <h2> Уран </h2>   <p>Уран это седьмая планета от Солнца и третий самый большой газоввый гигант Солнечной системы. Он один из самых холодных планет Солнечной системы.</p>  <h3>Энциклопедия</h3> <span><mark>Период обращения: 84 года 4 суток.</mark><br>Диаметр на экваторе: 51118 км.<br><mark>Период вращения планеты (оборот вокруг оси): 17 часов 14 мин.</mark><br>Температура поверхности: –214 градусов (средняя).<br><mark>Атмосфера: в основном водород и гелий.</mark><br>Сколько спутников: 15 (+ кольца).<br><mark>Главные спутники: Титания, Оберон.</mark></span>',

    'neptune' : ' <h2> Нептун </h2>  <p>Нептун - восьмая и официально самая дальняя планета от Солнца. Эта самая маленькая, но самая плотная планета газовый гигант. Сила гравитации на поверхности Нептуна уступает только Юпитеру. </p> <h3>Энциклопедия</h3> <span><mark>Период обращения вокруг Солнца: 164 года 292 суток.</mark><br>Диаметр на экваторе: 50538 км.<br><mark>Период вращения (оборот вокруг оси): 16 часов 7 мин.</mark><br>Температура поверхности: –220 градусов (средняя).<br><mark>Атмосфера: в основном водород и гелий.</mark><br>Число спутников: 8.<br><mark>Главные спутники: Тритон.</mark></span>',

    'moon' : '<h2> Луна </h2>  <p>Луна - естественный спутник Земли. После Солнца, Луна оказывает наибольшее влияние на Землю, особенно это заметно по приливам и отливам.</p> <h3>Масса</h3> <span>Луна самый большой естественный спутник Земли, у нее 27% в диаметре и 60% плотности Земли. Луна больше чем Плутон.</span> <h3>Происхождение</h3> <span>На сегодняшний момент самая распространенная гипотеза о происхождении Луны говорит, что она сформировалась как результат столкновения с объектом сопоставимым по размеру с Марсом. Материал возникший в результате столкновения, сформировал Луну около 4,53 млрд. лет назад.</span>'
};
var descPanel;

var visibleOrbit={
    visible: function(){
            earthOrbit.visible=true;
            mercuryOrbit.visible=true;
            venusOrbit.visible=true;
            marsOrbit.visible=true;
            jupiterOrbit.visible=true;
            saturnOrbit.visible=true;
            uranOrbit.visible=true;
            neptuneOrbit.visible=true;
    },
    hidden: function(){
            earthOrbit.visible=false;
            mercuryOrbit.visible=false;
            venusOrbit.visible=false;
            marsOrbit.visible=false;
            jupiterOrbit.visible=false;
            saturnOrbit.visible=false;
            uranOrbit.visible=false;
            neptuneOrbit.visible=false;
    }
};

/**
 * Конструктор позволяет не вводить имена свойств для объекта планеты для каждой отдельной планеты
 * @param {number} myOrbitRate
 * @param {number} myRotationRate
 * @param {number} myDistanceFromAxis
 * @param {string} myName
 * @param {string} myTexture
 * @param {number} mySize
 * @param {number} mySegments
 * @returns {constructPlanetData.mainAnonym$0}
 */
function constructPlanetData(myOrbitRate, myRotationRate, myDistanceFromAxis, myName, myTexture, mySize, mySegments) {
    return {
        orbitRate: myOrbitRate, //период обращения вокруг солнца
        rotationRate: myRotationRate, //скорость вращения вокруг своей оси
        distanceFromAxis: myDistanceFromAxis, //расстояние от солнца
        name: myName, //имя планеты
        texture: myTexture, //загружаемая текстура
        size: mySize, //размер планеты
        segments: mySegments //количество сегментов
    };
}

/**
 * Используется для создания кольца Сатурна и Урана.
 * @param {number} size
 * @param {number} innerDiameter
 * @param {number} facets
 * @param {color} myColor
 * @param {type} name
 * @param {number} distanceFromAxis
 * @returns {THREE.Mesh|myRing}
 */
function getPlanetRing(size, innerDiameter, facets, myColor, name, distanceFromAxis, texture=null, mySide=THREE.DoubleSide, myTransparent=false, myOpacity=1) {
    //геометрия орбиты
    var ring1Geometry = new THREE.TorusGeometry(size, innerDiameter, facets, 60);
    //материал (внешний вид) орбиты
    var ring1Material = new THREE.MeshBasicMaterial({color: myColor, side: mySide, map:texture, transparent: myTransparent, opacity: myOpacity});
    //объединение геометрии и материала орбиты
    var myRing = new THREE.Mesh(ring1Geometry, ring1Material);
    //имя орбиты
    myRing.name = name;
    myRing.position.set(distanceFromAxis, 0, 0);
    //орбита горизонтальна
    myRing.rotation.x = Math.PI / 2;
    //добавление орбиты на сцену
    scene.add(myRing);
    return myRing;
}

/**
 * Создаёт видимую орбиту планеты.
 * @param {number} distanceFromAxis расстояние планеты от солнца(радиус орбиты).
 * @param {number} positionX смещение орбиты по оси x.
 * @param {number} positionZ смещение орбиты по оси z.
 * @param {color} myColor цвет орбиты
 * @param {string} name название орбиты
 * @returns {THREE.Mesh|orbit} возвращает объект orbit
 */ 
function getOrbit(distanceFromAxis, positionX, positionZ, myColor, name) {
    //геометрия орбиты
    var orbit_geometry = new THREE.CircleGeometry(distanceFromAxis, 64, 0, 6.3);
    orbit_geometry.vertices[0]['x'] = distanceFromAxis;
    //материал орбиты
    var orbit_material = new THREE.LineBasicMaterial(  { color: myColor, linewidth: 1 } );
    var orbit = new THREE.Line( orbit_geometry, orbit_material );
    //имя орбиты
    orbit.name = name;
    //орбита горизонтальна
    orbit.rotation.x = Math.PI/2;
    //позиция
    orbit.position.set(positionX, 0, positionZ);
    //добавление орбиты на сцену
    scene.add( orbit ); 
    return orbit;
}

/**
 * Создание материала(внешнего вида) для используемых объектов
 * @param {string} type
 * @param {color} color
 * @param {string} myTexture
 * @returns {THREE.MeshStandardMaterial|THREE.MeshLambertMaterial|THREE.MeshPhongMaterial|THREE.MeshBasicMaterial}
 */
function getMaterial(type, color, myTexture) {
    //цвет и текстура в одном объекте materialOptions
    var materialOptions = {
        color: color === undefined ? 'rgb(255, 255, 255)' : color,
        map: myTexture === undefined ? null : myTexture
    };

    //используется материал определённого типа
    switch (type) {
        case 'basic':
            return new THREE.MeshBasicMaterial(materialOptions);
        case 'lambert':
            return new THREE.MeshLambertMaterial(materialOptions);
        case 'phong':
            return new THREE.MeshPhongMaterial(materialOptions);
        case 'standard':
            return new THREE.MeshStandardMaterial(materialOptions);
        default:
            return new THREE.MeshBasicMaterial(materialOptions);
    }
}

/**
 *  Рисует все орбиты, которые будут показаны на сцене
 * @returns {undefined}
 */
function createVisibleOrbits() {
    //ширина орбиты
    var orbitColor = 0x7989a2;
    //орбита Земли
    earthOrbit = getOrbit(earthData.distanceFromAxis, 0, 0, orbitColor, "earthOrbit");
    //орбита Меркурия
    mercuryOrbit = getOrbit(mercuryData.distanceFromAxis, 4, 0, orbitColor, "mercuryOrbit");
    //орбита Венеры
    venusOrbit = getOrbit(venusData.distanceFromAxis, 0, 0, orbitColor, "venusOrbit");
    //орбита Марса
    marsOrbit = getOrbit(marsData.distanceFromAxis, 0, 10, orbitColor, "marsOrbit");
    //орбита Юпитера
    jupiterOrbit = getOrbit(jupiterData.distanceFromAxis, -5, 10, orbitColor, "jupiterOrbit");
    //орбита Сатурна
    saturnOrbit = getOrbit(saturnData.distanceFromAxis, 0, 0, orbitColor, "saturnOrbit");
    //орбита Урана
    uranOrbit = getOrbit(uranData.distanceFromAxis, 0, -10, orbitColor, "uranOrbit");
    //орбита Нептуна
    neptuneOrbit = getOrbit(neptuneData.distanceFromAxis, 0, 0, orbitColor, "neptuneOrbit");
}

/**
 * Упрощает создание сферы
 * @param {THREE.SOME_TYPE_OF_CONSTRUCTED_MATERIAL} material
 * @param {number} size
 * @param {number} segments
 * @returns {getSphere.obj|THREE.Mesh}
 */
function getSphere(material, size, segments) {
    //геометрия сферы
    var geometry = new THREE.SphereGeometry(size, segments, segments);
    //меш
    var obj = new THREE.Mesh(geometry, material);
    //тени
    obj.castShadow = true;

    return obj;
}

/**
 * Создание планеты и добавление её на сцену
 * @param {object} myData
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {string} myMaterialType
 * @returns {getSphere.obj|THREE.Mesh|loadTexturedPlanet.myPlanet}
 */
function loadTexturedPlanet(myData, x, y, z, myMaterialType) {
    //материал
    var myMaterial;
    //текстура планеты
    var passThisTexture;

    if (myData.texture && myData.texture !== "") {
        passThisTexture = new THREE.ImageUtils.loadTexture(myData.texture);
    }
    if (myMaterialType) {
        myMaterial = getMaterial(myMaterialType, "rgb(255, 255, 255 )", passThisTexture);
    } else {
        myMaterial = getMaterial("lambert", "rgb(255, 255, 255 )", passThisTexture);
    }

    myMaterial.receiveShadow = true;
    myMaterial.castShadow = true;
    //создание сферы
    var myPlanet = getSphere(myMaterial, myData.size, myData.segments);
    myPlanet.receiveShadow = true;
    myPlanet.name = myData.name;
    scene.add(myPlanet);
    myPlanet.position.set(x, y, z);

    return myPlanet;
}

/**
 * Упрощает создание света, который рассеивается во всех направлениях.
 * @param {number} intensity
 * @param {color} color
 * @returns {THREE.PointLight|getPointLight.light}
 */
function getPointLight(intensity, color) {
    var light = new THREE.PointLight(color, intensity);
    light.castShadow = true;

    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    return light;
}

/**
 * Перемещение планеты по орбите и вращение вокруг оси
 * @param {object} myPlanet
 * @param {object} myData
 * @param {number} myTime
 * @param {bool} stopRotation
 * @returns {undefined}
 */
function movePlanet(myPlanet, myData, myTime, displacementX=0, displacementZ=0, stopRotation) {
    if (orbitData.runRotation && !stopRotation) {
        //вращение вокруг своей оси
        myPlanet.rotation.y += myData.rotationRate;
    }
    if (orbitData.runOrbit) {
        //Перемещение планеты по орбите
        myPlanet.position.x = Math.cos(myTime
                * (1.0 / (myData.orbitRate * orbitData.value)) + 10.0)
                * myData.distanceFromAxis;
        myPlanet.position.z = Math.sin(myTime
                * (1.0 / (myData.orbitRate * orbitData.value)) + 10.0)
                * myData.distanceFromAxis;
        //смещение
        myPlanet.position.x += displacementX;
        myPlanet.position.z += displacementZ;
    }
}

/**
 * Движение Луны вокруг Земли и вращание вокруг своей оси
 * @param {object} myMoon
 * @param {object} myPlanet
 * @param {object} myData
 * @param {number} myTime
 * @returns {undefined}
 */
function moveMoon(myMoon, myPlanet, myData, myTime) {
    movePlanet(myMoon, myData, myTime);
    if (orbitData.runOrbit) {
        myMoon.position.x = myMoon.position.x + myPlanet.position.x;
        myMoon.position.z = myMoon.position.z + myPlanet.position.z;
    }
}

/**
 * Эта функция вызывается в цикле для создания анимации
 * @param {object} renderer
 * @param {object} scene
 * @param {object} camera
 * @param {object} controls
 * @returns {undefined}
 */
function update(renderer, scene, camera, controls) {

    //источник света находится внутри солнца
    pointLight.position.copy(sun.position);
    //обновление controls, чтобы переместить камеру туда же, где и пользователь
    controls.update();

    //текущее время
    var time = Date.now();

    //передвижение Земли
    movePlanet(earth, earthData, time);
    //передвижение Луны
    moveMoon(moon, earth, moonData, time);
    //передвижение Меркурия
    movePlanet(mercury, mercuryData, time, 4);
    //передвижение Венеры
    movePlanet(venus, venusData, time);
    //передвижение Марса
    movePlanet(mars, marsData, time, 0, 10);
    //передвижение Юпитера
    movePlanet(jupiter, jupiterData, time, -5, 10);
    //передвижение Сатурна
    movePlanet(saturn, saturnData, time);
    //синхронное движение кольца по орбите
    movePlanet(saturnRing, saturnData, time, 0, 0, true);
    //передвижение Урана
    movePlanet(uran, uranData, time, 0, -10);
    //синхронное движение кольца по орбите
    movePlanet(uranRing, uranData, time, 0, -10, true);
    //передвижение Нептуна
    movePlanet(neptune, neptuneData, time);

    //рендер сцены
    renderer.render(scene, camera);
    //кадр
    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    });
}

/**
 * Функция запуска
 * @returns {THREE.Scene|scene}
 */
function init() {
    //Создание камеры, которая позволяет смотреть на сцену
    camera = new THREE.PerspectiveCamera(
            60, //поле зрения
            window.innerWidth / window.innerHeight, //соотношение сторон
            1, //ближняя плоскость отсечения
            2000 //дальняя плоскость отсечения
            );
    //позиция камеры
    camera.position.z = 70;
    camera.position.x = -70;
    camera.position.y = 70;
    //камера направлена в центр сцены
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    //Создание сцены, которая содержит все видимые объекты
    scene = new THREE.Scene();

    //Создание рендера, управляющего анимацией
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    //Вывод картинки в div с id='webgl'
    document.getElementById('webgl').appendChild(renderer.domElement);
    //описание планеты
    descPanel = document.getElementById('description');
    descPanel.style.display = "block";

    //Создание элементов управления, которые позволяют пользователю перемещать сцену с помощью мыши
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 30;
    controls.maxDistance = 800;

    //Загрузка изображений для фона(background)
    var path = 'cubemap/';
    var format = '.jpg';
    var urls = [
        path + 'stars' + format, path + 'stars' + format,
        path + 'stars' + format, path + 'stars' + format,
        path + 'stars' + format, path + 'stars' + format
    ];
    var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBFormat;

    //Установка фона сцены
    scene.background = reflectionCube;

    //Создание света от солнца
    pointLight = getPointLight(1.5, "rgb(255, 220, 180)");
    scene.add(pointLight);
    pointLight.intensity = 1.2;

    //Создание света, который освещает объекты
    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);
    ambientLight.intensity = 0.3;

    //Создание солнца
    var sunMaterial = getMaterial("basic", "rgb(255, 255, 255)", new THREE.ImageUtils.loadTexture("img/sunmap.jpg"));
    sun = getSphere(sunMaterial, 16, 48);
    sun.name = 'sun';
    scene.add(sun);

    //Создание свечения от солнца
    var spriteMaterial = new THREE.SpriteMaterial(
            {
                map: new THREE.ImageUtils.loadTexture("img/glow.png"), useScreenCoordinates: false,
                color: 0xffffee,
                transparent: false,
                blending: THREE.AdditiveBlending
            });
    var sprite = new THREE.Sprite(spriteMaterial);
    //центрирование свечения от солнца
    sprite.scale.set(48, 48, 1.0);
    sun.add(sprite);

    //Создание видимых орбит
    createVisibleOrbits();

    //Создание Земли
    earth = loadTexturedPlanet(earthData, earthData.distanceFromAxis, 0, 0);
    //Создание Луны
    moon = loadTexturedPlanet(moonData, moonData.distanceFromAxis, 0, 0);
    //Создание Меркурия
    mercury = loadTexturedPlanet(mercuryData, mercuryData.distanceFromAxis, 0, 0);
    //Создание Венеры
    venus = loadTexturedPlanet(venusData, venusData.distanceFromAxis, 0, 0);
    //Создание Марса
    mars = loadTexturedPlanet(marsData, marsData.distanceFromAxis, 0, 0);
    //Создание Юпитера
    jupiter = loadTexturedPlanet(jupiterData, jupiterData.distanceFromAxis, 0, 0);
    //Создание Сатурна
    saturn = loadTexturedPlanet(saturnData, saturnData.distanceFromAxis, 0, 0);
    //Кольцо Сатурна
    saturnRing = getPlanetRing(18, 3, 2, 0x757064, "saturn", saturnData.distanceFromAxis, new THREE.ImageUtils.loadTexture("img/saturnring.jpg"), THREE.FrontSide);
    //Создание Урана
    uran = loadTexturedPlanet(uranData, uranData.distanceFromAxis, 0, 0);
    //Кольцо Урана
    uranRing = getPlanetRing(12.5, 2, 2, 0x757064, "uranus", uranData.distanceFromAxis, new THREE.ImageUtils.loadTexture("img/uranusring.jpg"), THREE.FrontSide, true, 0.2);
    //Создание Нептуна
    neptune = loadTexturedPlanet(neptuneData, neptuneData.distanceFromAxis, 0, 0);

    //Создание графического интерфейса, отображающего элементы управления
    var gui = new dat.GUI();
    gui.width = 350;
    var folder1 = gui.addFolder('Свет');
    folder1.add(pointLight, 'intensity', 0, 2).name('Интенсивность');
    folder1.add(ambientLight, 'intensity', 0, 1).name('Освещение объектов');
    var folder2 = gui.addFolder('Движение планет');
    folder2.add(orbitData, 'value', 0, 200).name('Период обращения');
    folder2.add(orbitData, 'runOrbit', 0, 1).name('Остановить движение');
    folder2.add(orbitData, 'runRotation', 0, 1).name('Остановить вращение');
    var folder3 = gui.addFolder('Видимость орбит');
    folder3.add(visibleOrbit, 'visible').name('Показать');
    folder3.add(visibleOrbit, 'hidden').name('Скрыть'); 

    //слушатели для клика и наведения курсора мыши
    raycaster = new THREE.Raycaster();
    renderer.domElement.addEventListener( 'click', raycast, false );
    renderer.domElement.addEventListener( 'mousemove', raycast2, false );

    window.addEventListener( 'resize', onWindowResize, false );

    //Старт анимации
    update(renderer, scene, camera, controls);
}

//клик мыши по объекту
function raycast ( e ) {

    //определение позиции курсора мыши в координатной системе, где центр экрана является точкой (0,0)
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    //соотношение положения камеры и координат курсора мыши
    raycaster.setFromCamera( mouse, camera );    

    //вычисляются пересечения
    var intersects = raycaster.intersectObjects( scene.children );

    for ( var i = 0; i < intersects.length; i++ ) {
        if(intersects[i].object.type == 'Mesh') {
            //смена позиции камеры
            camera.position.z = intersects[i].object.position.z+20;
            camera.position.x = intersects[i].object.position.x+20;
            camera.position.y = intersects[i].object.position.y+20;
            controls.target = intersects[i].object.position;
        }
    }
    controls.update();
    renderer.render(scene, camera);
}

//наведение мыши на объект
function raycast2 ( e ) {
    descPanel.innerHTML = "";

    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );    

    var intersects = raycaster.intersectObjects( scene.children );

    for ( var i = 0; i < intersects.length; i++ ) {
        if(intersects[i].object.type == 'Mesh')
        descPanel.innerHTML = dataArray[intersects[i].object.name];
    }
    renderer.render(scene, camera);
}

//при изменении размеров окна
function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//Запуск программы
init();