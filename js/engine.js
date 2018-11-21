var container, stats;
var camera, controls, scene, renderer;
var objects = [];
var cubeSize=50;
var cc=document.getElementById("canvasElement");

init();
animate();

function init() {
	//Creando la camara
	camera = new THREE.PerspectiveCamera( 70, cc.clientWidth / cc.clientHeight, 1, 1000 );
	camera.position.set( cubeSize*3, cubeSize*3, cubeSize*3 );
	
	//Creando el render
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( cc.devicePixelRatio );
	renderer.setSize( cc.clientWidth, cc.clientHeight );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;
	
	//Creando los controles
	controls = new THREE.TrackballControls( camera );
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	
	//Cargando las texturas				
	var geometry = new THREE.BoxBufferGeometry( cubeSize, cubeSize, cubeSize );
	
	//Creando la escena
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xf0f0f0 );
	scene.add( new THREE.AmbientLight( 0x505050 ) );
	var light = new THREE.SpotLight( 0xffffff, 1.5 );
	light.position.set( 0, 500, 2000 );
	light.angle = Math.PI / 9;
	light.castShadow = true;
	light.shadow.camera.near = 1000;
	light.shadow.camera.far = 4000;
	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;
	scene.add( light );
	
	//Creando el cubo
	for(var a=0;a<3;a++){//Z
		for(var b=0;b<3;b++){//Y
			for(var c=0;c<3;c++){//X

				//Algoritmos de selección de texturas
				var adelante=6+(c+1);
				var arriba=3+(a+1)
				var lado=3-b;						
				
				var material = [
					new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('redes/'+adelante+'.png') } ),//Frente
					new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('redes/'+adelante+'.png') } ),//Detras
					new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('redes/'+arriba+'.png') } ),//Arriba
					new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('redes/'+arriba+'.png') } ),//Abajo
					new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('redes/'+lado+'.png') } ),//Izquierda
					new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('redes/'+lado+'.png') } )//Derecha
				]
			
				var object = new THREE.Mesh( geometry, material );
				object.position.x = (-1*cubeSize)+a*cubeSize;
				object.position.y = (-1*cubeSize)+b*cubeSize;
				object.position.z = (-1*cubeSize)+c*cubeSize;
				
				object.castShadow = true;
				object.receiveShadow = true;
				
				scene.add( object );
				objects.push( object );
			}
		}
	}
	
	//Estableciendo el render
	cc.innerHTML ="";
	cc.appendChild( renderer.domElement );
	
	//Configurando los eventos del control drag del mouse
	var dragControls = new THREE.DragControls( objects, camera, renderer.domElement );
	dragControls.addEventListener( 'dragstart', function () {
		controls.enabled = false;
	} );
	dragControls.addEventListener( 'dragend', function () {
		controls.enabled = true;
	} );
	
	//Sobrecargando el evento de tamaño
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	camera.aspect = cc.clientWidth / cc.clientHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( cc.clientWidth, cc.clientHeight );
}

function animate() {
	requestAnimationFrame( animate );
	if(document.getElementById("rotateX").checked)
		scene.rotation.x += 0.5*Math.PI/180;

	if(document.getElementById("rotateY").checked)
		scene.rotation.y += 0.5*Math.PI/180;

	if(document.getElementById("rotateZ").checked)
		scene.rotation.z += 0.5*Math.PI/180;
		
	controls.update();
	renderer.render( scene, camera );
}

var newpos=[];
var complete=0, topA=50;

function explodeC(){
	complete=0;
	for(var i=0;i<objects.length;i++){
		newpos[i]=[Math.random() * 500 - 200, Math.random() * 300 - 100, Math.random() * 400 - 120];
		//console.log(newpos[i]);
	}		
	explodeA();
}

function explodeA(){
	for(var i=0;i<objects.length;i++)
		objects[i].position.set((newpos[i][0]/topA)*complete, (newpos[i][1]/topA)*complete, (newpos[i][2]/topA)*complete);
	complete++;
	controls.update();
	renderer.render( scene, camera );
	if(complete<topA)
		requestAnimationFrame( explodeA );
}

function restoreC(){
	document.getElementById("rotateX").checked=false;
	document.getElementById("rotateY").checked=false;
	document.getElementById("rotateZ").checked=false;
	controls.reset();
	objects = [];
	scene.rotation.y = 0*Math.PI/180;
	scene.rotation.z = 0*Math.PI/180;
	scene.rotation.x = 0*Math.PI/180;
	camera.position.set( cubeSize*3, cubeSize*3, cubeSize*3 );
	camera.updateProjectionMatrix();
	controls.update();
	cont=0;
	complete=0;
	init();
}

function restorePosition(){
	controls.reset();
	scene.rotation.y = 0*Math.PI/180;
	scene.rotation.z = 0*Math.PI/180;
	scene.rotation.x = 0*Math.PI/180;
	camera.position.set( cubeSize*3, cubeSize*3, cubeSize*3 );
	camera.updateProjectionMatrix();
	controls.update();
	var cube=0;
	for(var a=0;a<3;a++){//Z
		for(var b=0;b<3;b++){//Y
			for(var c=0;c<3;c++){//X
				objects[cube].position.x = (-1*cubeSize)+a*cubeSize;
				objects[cube].position.y = (-1*cubeSize)+b*cubeSize;
				objects[cube].position.z = (-1*cubeSize)+c*cubeSize;
				cube++;
			}
		}
	}
	controls.update();
	renderer.render( scene, camera );
}

var cont=0, topB=50, typeS=1;
function slice(type){
	restorePosition();
	cont=0;
	typeS=type;
	requestAnimationFrame( moveSlice );
}

function moveSlice(){
	switch(typeS){
		case 1://Critical Information Characteristics
			for(var c=0;c<3;c++){//Y
				objects[6+c].position.y ++;
				objects[15+c].position.y ++;
				objects[24+c].position.y ++;
				
				objects[0+c].position.y --;
				objects[9+c].position.y --;
				objects[18+c].position.y --;
			}
			scene.rotation.y += 0.85*Math.PI/180;
			scene.rotation.z += 0.4*Math.PI/180;
			scene.rotation.x -= 0.6*Math.PI/180;
			break;
		case 2://Information States
			for(var c=0;c<9;c++){//X
				objects[0+c].position.x --;
				
				objects[18+c].position.x ++;
			}
			scene.rotation.y += 0.3*Math.PI/180;
			scene.rotation.z -= 0.9*Math.PI/180;
			scene.rotation.x += 1.45*Math.PI/180;
			break;
		case 3://Security Measures
			for(var c=0;c<objects.length;c++){//Z
				if(c%3==0)
					objects[c].position.z --;
				else if(c%3==2)
					objects[c].position.z ++;
			}
			scene.rotation.y -= 0.85*Math.PI/180;
			scene.rotation.z += 0.6*Math.PI/180;
			scene.rotation.x -= 0.05*Math.PI/180;
			break;
	}
	controls.update();
	renderer.render( scene, camera );
	cont++;
	if(cont<topB)
		requestAnimationFrame( moveSlice );
	else{
		/*switch(typeS){
			case 1://Critical Information Characteristics
				scene.rotation.y += 40*Math.PI/180;
				break;
			case 2://Information States
				scene.rotation.x += 1*Math.PI/180;
				scene.rotation.y += 1*Math.PI/180;
				break;
			case 3://Security Measures
				scene.rotation.z += 1*Math.PI/180;
				break;
		}
		*/
	}
}