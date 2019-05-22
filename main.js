var pointLight, sun, moon, earth, earthOrbit, ring, controls, scene, camera, renderer, scene;
var planetSegments = 48;
var earthData = constructPlanetData(365.2564, 0.015, 25, "earth", "img/earth.jpg", 1, planetSegments);
var moonData = constructPlanetData(29.5, 0.01, 2.8, "moon", "img/moon.jpg", 0.5, planetSegments);
var orbitData = {value: 200, runOrbit: true, runRotation: true};
//объект для отслеживания времени
var clock = new THREE.Clock();

/**
 * Конструктор позволяет не вводить имена свойств для объекта планеты для каждой отдельной планеты
 * @param {type} myOrbitRate decimal
 * @param {type} myRotationRate decimal
 * @param {type} myDistanceFromAxis decimal
 * @param {type} myName string
 * @param {type} myTexture image file path
 * @param {type} mySize decimal
 * @param {type} mySegments integer
 * @returns {constructPlanetData.mainAnonym$0}
 */
function constructPlanetData(myOrbitRate, myRotationRate, myDistanceFromAxis, myName, myTexture, mySize, mySegments) {
    return {
        orbitRate: myOrbitRate
        , rotationRate: myRotationRate
        , distanceFromAxis: myDistanceFromAxis
        , name: myName
        , texture: myTexture
        , size: mySize
        , segments: mySegments
    };
}

/**
 * getRing создаёт видимое кольцо(орбиту) и добавляет на сцену
 * @param {type} size decimal
 * @param {type} innerDiameter decimal
 * @param {type} facets integer
 * @param {type} myColor HTML color
 * @param {type} name string
 * @param {type} distanceFromAxis decimal
 * @returns {THREE.Mesh|myRing}
 */
function getRing(size, innerDiameter, facets, myColor, name, distanceFromAxis) {
    //геометрия орбиты
    var ring1Geometry = new THREE.RingGeometry(size, innerDiameter, facets);
    //материал (внешний вид) орбиты
    var ring1Material = new THREE.MeshBasicMaterial({color: myColor, side: THREE.DoubleSide});
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
 * getTube создаёт трёхмерное кольцо (тор), которое используется для сатурна
 * @param {type} size decimal
 * @param {type} innerDiameter decimal
 * @param {type} facets integer
 * @param {type} myColor HTML color
 * @param {type} name string
 * @param {type} distanceFromAxis decimal
 * @returns {THREE.Mesh|myRing}
 */
function getTube(size, innerDiameter, facets, myColor, name, distanceFromAxis) {
    //геометрия кольца
    var ringGeometry = new THREE.TorusGeometry(size, innerDiameter, facets, facets);
    //материал кольца
    var ringMaterial = new THREE.MeshBasicMaterial({color: myColor, side: THREE.DoubleSide});
    myRing = new THREE.Mesh(ringGeometry, ringMaterial);
    //имя кольца
    myRing.name = name;
    myRing.position.set(distanceFromAxis, 0, 0);
    //горизонтальное положение кольца
    myRing.rotation.x = Math.PI / 2;
    //добавление на сцену кольца
    scene.add(myRing);
    return myRing;
}

/**
 * Создание материала(внешнего вида) для используемых объектов
 * @param {type} type
 * @param {type} color
 * @param {type} myTexture
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
    var orbitWidth = 0.02;
    //орбита Земли
    earthOrbit = getRing(earthData.distanceFromAxis + orbitWidth
        , earthData.distanceFromAxis - orbitWidth
        , 320
        , 0xffffff
        , "earthOrbit"
        , 0);
}

/**
 * Упрощает создание сферы
 * @param {type} material THREE.SOME_TYPE_OF_CONSTRUCTED_MATERIAL
 * @param {type} size decimal
 * @param {type} segments integer
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
 * @param {type} myData data for a planet object
 * @param {type} x integer
 * @param {type} y integer
 * @param {type} z integer
 * @param {type} myMaterialType string that is passed to getMaterial()
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
 * @param {type} intensity decimal
 * @param {type} color HTML color
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
 * @param {type} myPlanet
 * @param {type} myData
 * @param {type} myTime
 * @param {type} stopRotation optional set to true for rings
 * @returns {undefined}
 */
function movePlanet(myPlanet, myData, myTime, stopRotation) {
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
    }
}

/**
 * Движение Луны вокруг Земли и вращание вокруг свойе оси
 * @param {type} myMoon
 * @param {type} myPlanet
 * @param {type} myData
 * @param {type} myTime
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
 * @param {type} renderer
 * @param {type} scene
 * @param {type} camera
 * @param {type} controls
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
    //синхронное движение кольца по орбите
    movePlanet(ring, earthData, time, true);
    //передвижение луны
    moveMoon(moon, earth, moonData, time);

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
            45, //поле зрения
            window.innerWidth / window.innerHeight, //соотношение сторон
            1, //ближняя плоскость отсечения
            1000 //дальняя плоскость отсечения
            );
    //позиция камеры
    camera.position.z = 30;
    camera.position.x = -30;
    camera.position.y = 30;
    //камера направлена в центр сцены
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    //Создание сцены, которая содержит все видимые объекты
    scene = new THREE.Scene();

    //Создание рендера, управляющего анимацией
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    //Вывод картинки в div с id='webgl'
    document.getElementById('webgl').appendChild(renderer.domElement);

    //Создание элементов управления, которые позволяют пользователю перемещать сцену с помощью мыши
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //Загрузка изображений для фона(background)
    var path = 'cubemap/';
    var format = '.jpg';
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];
    var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBFormat;

    //Установка фона сцены
    scene.background = reflectionCube;

    //Создание света от солнца
    pointLight = getPointLight(1.5, "rgb(255, 220, 180)");
    scene.add(pointLight);

    //Создание света, который освещает объекты
    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    //Создание солнца
    var sunMaterial = getMaterial("basic", "rgb(255, 255, 255)");
    sun = getSphere(sunMaterial, 16, 48);
    scene.add(sun);

    //Создание свечения от солнца
    var spriteMaterial = new THREE.SpriteMaterial(
            {
                map: new THREE.ImageUtils.loadTexture("img/glow.png")
                , useScreenCoordinates: false
                , color: 0xffffee
                , transparent: false
                , blending: THREE.AdditiveBlending
            });
    var sprite = new THREE.Sprite(spriteMaterial);
    //центрирование свечения от солнца
    sprite.scale.set(70, 70, 1.0);
    sun.add(sprite);

    //Создание Земли, Луны и кольца вокруг Земли.
    earth = loadTexturedPlanet(earthData, earthData.distanceFromAxis, 0, 0);
    moon = loadTexturedPlanet(moonData, moonData.distanceFromAxis, 0, 0);
    ring = getTube(1.8, 0.05, 480, 0x757064, "ring", earthData.distanceFromAxis);

    //Создание видимой орбиты Земли
    createVisibleOrbits();

    //Создание графического интерфейса, отображающего элементы управления
    var gui = new dat.GUI();
    var folder1 = gui.addFolder('light');
    folder1.add(pointLight, 'intensity', 0, 10);
    var folder2 = gui.addFolder('speed');
    folder2.add(orbitData, 'value', 0, 500);
    folder2.add(orbitData, 'runOrbit', 0, 1);
    folder2.add(orbitData, 'runRotation', 0, 1);

    //Старт анимации
    update(renderer, scene, camera, controls);
}

//Запуск программы
init();
