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

var gravity = 1;
var playerBasePositionY = -50;

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
            player.shadowObject.position.z = playerPosition - 150;
            player.cameraObject.position.z = playerPosition + 1250;
            player.modelObject.position.y += player.bounceValue;

            if(player.modelObject.position.y > playerBasePositionY)
                player.setBounceValue(player.bounceValue - gravity);
            else
                player.setBounceValue(0);
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
            eye: [ 0, 0, 2000 ],
            up: [ 0, 1, 0 ],
            fov: 30,
            updateCamera: function ( camera, scene, mouseX ) {

            }
        });
    } else {
        for(var i = 0; i < game.players.length(); i++){

            var backgroundColor = game.players.get(i).backgroundColor;

            views.push({
                left: (1/game.players.length()) * i,
                top: 0,
                width: 1/game.players.length(),
                height: 1.0,
                background: new THREE.Color(backgroundColor),
                eye: [ -450 + (i*220), 350, 1250 ],
                up: [ 0, 1, 0 ],
                fov: 30,
                updateCamera: function ( camera, scene, mouseX ) {
                    //camera.position.z += mouseY * 0.05;
                }
            });
        }
    }

    for ( var ii = 0; ii < views.length; ++ ii ) {

        var view = views[ ii ];

        var camera = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.fromArray( view.eye );
        camera.up.fromArray( view.up );
        if(game.players.length() !== 0)
            game.players.get(ii).setCamera(camera);
        view.camera = camera;
    }
}

function createWaitingScreen(){
    // Text

    var loader = new THREE.FontLoader();

    loader.load('node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        var textGeo = new THREE.TextGeometry("En attente de joueurs...", {
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

    var shadowGeo = new THREE.PlaneBufferGeometry( 1300, 300, 1, 1 );

    var shadowMesh;

    shadowMesh = new THREE.Mesh( shadowGeo, shadowMaterial );
    shadowMesh.position.x = 0;
    shadowMesh.position.y = - 250;
    shadowMesh.rotation.x = - Math.PI / 2;
    waitingGroup.add( shadowMesh );
}

function createRunners(){
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
    var geometry = new THREE.PlaneGeometry( 1500, 44500, 32 );
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

    //Start Line
    var linematerial = new THREE.LineBasicMaterial( { color: 0xff0000 } );

    var startgeometry = new THREE.Geometry();
    startgeometry.vertices.push(new THREE.Vector3( -700, 0, -150) );
    startgeometry.vertices.push(new THREE.Vector3( 700, 0, -150) );

    var startline = new THREE.Line( startgeometry, linematerial );

    runningGroup.add(startline);

    //End Line

    var endgeometry = new THREE.Geometry();
    endgeometry.vertices.push(new THREE.Vector3( -700, 0, game.getRelativePosition(110)) );
    endgeometry.vertices.push(new THREE.Vector3( 700, 0, game.getRelativePosition(110)) );

    var endline = new THREE.Line( endgeometry, linematerial );

    runningGroup.add(endline);

    //Hurdles
    for(let hurdle of game.hurdles) {
        for (var i = 0; i < game.players.length(); i++) {
            var geometry = new THREE.PlaneGeometry(200, 300, 32);
            var material = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});
            var hurdleMesh = new THREE.Mesh(geometry, material);
            hurdleMesh.position.x = -457 + (i*224);
            hurdleMesh.position.z = game.getRelativePosition(hurdle);
            runningGroup.add(hurdleMesh);
        }
    }

    //Shadows
    var shadowGeo = new THREE.PlaneBufferGeometry( 200, 200, 1, 1 );

    var shadowMesh;

    for(var i = 0; i < game.players.length(); i++) {
        shadowMesh = new THREE.Mesh(shadowGeo, shadowMaterial);
        shadowMesh.position.x = -457 + (i*224);
        shadowMesh.rotation.x = -Math.PI / 2;
        shadowMesh.position.y = 1;
        game.players.get(i).setShadow(shadowMesh);
        runningGroup.add(shadowMesh);
    }

    //Runners

    var loader = new THREE.GLTFLoader();

    // Load a glTF resource
    for(var i = 0; i < game.players.length(); i++) {
        loader.load(`view/running/models/${game.players.get(i).model}/scene.gltf`,
            (function (gltf) {
                var model = gltf.scene;
                model.scale.x = 50;
                model.scale.y = 50;
                model.scale.z = 50;
                model.position.x = -390 + (this.i*220);
                model.position.z = -150;
                model.position.y = playerBasePositionY;
                model.rotation.y = Math.PI;

                game.players.get(this.i).setModel(model);

                runningGroup.add(model);

                var mixer = new THREE.AnimationMixer(model);
                var animation = game.startTime ? gltf.animations[0] : game.players.get(this.i).state === 1 ? gltf.animations[1] : gltf.animations[2];
                mixer.clipAction(animation).play();
                game.players.get(this.i).setMixer(mixer);
                game.players.get(this.i).setAnimations(gltf.animations);

                render();
            }).bind({i: i}));
    }

    scene.add(runningGroup);
    animate();
}