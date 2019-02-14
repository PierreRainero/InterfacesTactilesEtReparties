if ( WEBGL.isWebGLAvailable() === false ) {

    document.body.appendChild( WEBGL.getWebGLErrorMessage() );

}

var container;

var views, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowWidth, windowHeight;

var waitingGroup, runningGroup;

var views = [];

var shadowMaterial;

var clock = new THREE.Clock();

var gravity = 0.5;
var playerBasePositionY = 15;
var cameraPositionZ = 1400;
var hurdlesObject = [];

setupViews();
init();
animate();

function init() {

    container = document.getElementById( 'container' );

    scene = new THREE.Scene();

    waitingGroup = new THREE.Group();
    runningGroup = new THREE.Group();

    scene.add(waitingGroup);
    //scene.add(runningGroup);

    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 0, 1 );
    scene.add( light );

    // shadow

    var canvas = document.createElement( 'canvas' );
    canvas.width = 128;
    canvas.height = 128;

    var context = canvas.getContext( '2d' );
    var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
    gradient.addColorStop( 0.1, 'rgba(0,0,0,0.15)' );
    gradient.addColorStop( 1, 'rgba(0,0,0,0)' );

    context.fillStyle = gradient;
    context.fillRect( 0, 0, canvas.width, canvas.height );

    var shadowTexture = new THREE.CanvasTexture( canvas );

    shadowMaterial = new THREE.MeshBasicMaterial( { map: shadowTexture, transparent: true } );

    createWaitingScreen();

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowWidth / 2 );
    mouseY = ( event.clientY - windowHeight / 2 );

}

function updateSize() {

    if ( windowWidth != window.innerWidth || windowHeight != window.innerHeight ) {

        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;

        renderer.setSize( windowWidth, windowHeight );

    }

}

function animate() {

    setupViews();

    render();

    requestAnimationFrame( animate );

}

function render() {

    updateSize();

    var delta = clock.getDelta();
    for(var i = 0; i < game.players.length(); i++) {
        var player = game.players.get(i);

        var mixer = player.mixer;
        if (mixer != null) {
            mixer.update(delta);
        }

        if(player.modelObject && player.shadowObject) {
            let playerPosition = game.getRelativePosition(player.progress);

            player.modelObject.position.z = playerPosition;
            player.modelObject.position.z += player.bounceValue;
            player.shadowObject.position.z = playerPosition - 50;
            if(!player.bot)
                player.cameraObject.position.z = playerPosition + cameraPositionZ;

            if(player.bounceValue > 0)
                player.setBounceValue(player.bounceValue - gravity);
            else
                player.setBounceValue(0);
        }

        for(let hurdleTab of hurdlesObject){
            for(let hurdle of hurdleTab){
                if(hurdle.fall && hurdle.model.position.y < 20 && hurdle.model.rotation.x > -(Math.PI/2)){
                    hurdle.model.position.y += 1.33;
                    hurdle.model.rotation.x -= 0.1;
                }
            }
        }
    }

    for ( var ii = 0; ii < views.length; ++ ii ) {

        var view = views[ ii ];
        var camera = view.camera;

        view.updateCamera( camera, scene, mouseX, mouseY );

        var left = Math.floor( windowWidth * view.left );
        var top = Math.floor( windowHeight * view.top );
        var width = Math.floor( windowWidth * view.width );
        var height = Math.floor( windowHeight * view.height );

        renderer.setViewport( left, top, width, height );
        renderer.setScissor( left, top, width, height );
        renderer.setScissorTest( true );
        renderer.setClearColor( view.background );

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.render( scene, camera );

    }

}

function setupViews(){
    views = [];
    if(game.players.length() === 0){
        views.push({
            left: 0,
            top: 0,
            width: 1,
            height: 1,
            background: new THREE.Color(0.5, 0.5, 0.5),
            eye: [ 0, 0, 2200 ],
            up: [ 0, 1, 0 ],
            fov: 30,
            updateCamera: function ( camera, scene, mouseX ) {

            }
        });
    } else {
        for(var i = 0; i < game.players.playerNumber(); i++){
            if(!game.players.getPlayer(i).bot) {
                views.push({
                    left: (1 / game.players.playerNumber()) * i,
                    top: 0,
                    width: 1 / game.players.playerNumber(),
                    height: 1.0,
                    background: new THREE.Color("rgb(92, 205, 205)"),
                    eye: [-450 + ((i+1) * 220), 350, cameraPositionZ],
                    up: [0, 1, 0],
                    fov: 30,
                    updateCamera: function (camera, scene, mouseX) {
                        //camera.position.z += mouseY * 0.05;
                    }
                });
            }
        }
    }

    for ( var ii = 0; ii < views.length; ++ ii ) {

        var view = views[ ii ];

        var camera = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.fromArray( view.eye );
        camera.up.fromArray( view.up );
        if(game.players.playerNumber() !== 0)
            game.players.getPlayer(ii).setCamera(camera);
        view.camera = camera;
    }
}

function createWaitingScreen(){
    // Text

    var loader = new THREE.FontLoader();

    loader.load('node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        var textGeo = new THREE.TextGeometry("Placez-vous dans un couloir de course", {
            font: font,
            size: 80,
            height: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 8,
            bevelSegments: 5
        });

        textGeo.center();

        var textMaterial = new THREE.MeshPhongMaterial(
            {color: 0xff0000, specular: 0xffffff}
        );

        var mesh = new THREE.Mesh(textGeo, textMaterial);
        mesh.position.y = 100;
        waitingGroup.add(mesh);
    });

    //Shadow

    var shadowGeo = new THREE.PlaneBufferGeometry( 2000, 300, 1, 1 );

    var shadowMesh;

    shadowMesh = new THREE.Mesh( shadowGeo, shadowMaterial );
    shadowMesh.position.x = 0;
    shadowMesh.position.y = - 250;
    shadowMesh.rotation.x = - Math.PI / 2;
    waitingGroup.add( shadowMesh );
}

function createRunners(){
    var loader = new THREE.GLTFLoader();

    scene.remove(waitingGroup);

    for (var i = runningGroup.children.length - 1; i >= 0; i--) {
        runningGroup.remove(runningGroup.children[i]);
    }

    //Ground
    var geometry = new THREE.PlaneGeometry( 88000, 88000, 32 );
    var texture = new THREE.TextureLoader().load( "view/running/textures/grass.jpg" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 400;
    texture.repeat.y = 400;
    var materialTexture = new THREE.MeshBasicMaterial( { map: texture } );
    var plane = new THREE.Mesh( geometry, materialTexture );
    plane.position.z = -22000;
    plane.rotateX(-Math.PI/2);
    runningGroup.add( plane );

    //RunningTrack
    var geometry = new THREE.PlaneGeometry( 1500, 45000, 32 );
    var texture = new THREE.TextureLoader().load( "view/running/textures/runningTrack.jpg" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 1;
    texture.repeat.y = 6;
    var materialTexture = new THREE.MeshBasicMaterial( { map: texture } );
    var plane = new THREE.Mesh( geometry, materialTexture );
    plane.position.z = -22250;
    plane.position.y = 1;
    plane.rotateX(-Math.PI/2);
    runningGroup.add( plane );

    //StartLine
    var geometry = new THREE.PlaneGeometry( 1500, 60, 32 );
    var texture = new THREE.TextureLoader().load( "view/running/textures/line.png" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 40;
    texture.repeat.y = 1;
    var materialTexture = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );
    var plane = new THREE.Mesh( geometry, materialTexture );
    plane.position.z = -260;
    plane.position.y = 1.1;
    plane.rotateX(-Math.PI/2);
    runningGroup.add( plane );

    //EndLine
    var plane = new THREE.Mesh( geometry, materialTexture );
    plane.position.z = game.getRelativePosition(110);
    plane.position.y = 1.1;
    plane.rotateX(-Math.PI/2);
    runningGroup.add( plane );

    //Hurdles
    hurdlesObject = [];
    for (var i = 0; i < game.players.length(); i++) {
        hurdlesObject.push([]);
        for(let hurdle of game.hurdles) {
            loader.load(`view/running/models/hurdle/scene.gltf`,
                (function (gltf) {
                    var model = gltf.scene;
                    model.scale.x = 190;
                    model.scale.y = 190;
                    model.scale.z = 190;
                    model.position.x = -450 + (this.i*220);
                    model.position.z = game.getRelativePosition(hurdle);
                    model.rotation.y = Math.PI;

                    hurdlesObject[this.i].push({model: model, fall: false});

                    runningGroup.add(model);

                    render();
                }).bind({i: i}));
        }
    }

    //Shadows
    var shadowGeo = new THREE.PlaneBufferGeometry( 200, 200, 1, 1 );

    var shadowMesh;

    for(var i = 0; i < game.players.length(); i++) {
        shadowMesh = new THREE.Mesh(shadowGeo, shadowMaterial);
        shadowMesh.position.x = -457 + (i*224);
        shadowMesh.rotation.x = -Math.PI / 2;
        shadowMesh.position.y = 1.1;
        shadowMesh.position.z = -50;
        game.players.get(i).setShadow(shadowMesh);
        runningGroup.add(shadowMesh);
    }

    //Runners
    for(var i = 0; i < game.players.length(); i++) {
        loader.load(`view/running/models/${game.players.get(i).model}/scene.gltf`,
            (function (gltf) {
                var model = gltf.scene;
                model.scale.x = 190;
                model.scale.y = 190;
                model.scale.z = 190;
                model.position.x = -450 + (this.i*220);
                model.position.z = -150;
                model.position.y = playerBasePositionY;
                model.rotation.y = Math.PI;

                game.players.get(this.i).setModel(model);

                runningGroup.add(model);

                game.players.get(this.i).setAnimations(gltf.animations);
                var mixer = new THREE.AnimationMixer(model);
                var animation = game.players.get(this.i).chooseAnimation();
                mixer.clipAction(animation).play();
                game.players.get(this.i).setMixer(mixer);

                render();
            }).bind({i: i}));
    }

    scene.add(runningGroup);
    animate();
}