<template>
    <div>
        <div id="notfound"></div>
        <ul id="scene">
            <li class="layer" data-depth="0.00"><img src="layer1.png"></li>
            <li class="layer" data-depth="0.20"><img src="layer2.png"></li>
            <li class="layer" data-depth="0.40"><img src="layer3.png"></li>
            <li class="layer" data-depth="0.60"><img src="layer4.png"></li>
            <li class="layer" data-depth="0.80"><img src="layer5.png"></li>
            <li class="layer" data-depth="1.00"><img src="layer6.png"></li>
        </ul>
    </div>
</template>
<script>

export default {
    name: 'notfound',
    data () {
        return {

        }
    },
    created () {

        var SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;

        var container;
        var camera, scene, renderer;

        var particles, particle, count = 0;

        var mouseX = 110, mouseY = -300;

        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;

        init();
        animate();

        function init() {

            container = document.createElement( 'div' );
            document.body.appendChild( container );

            camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
            camera.position.z = 1000;

            scene = new THREE.Scene();

            particles = new Array();

            var PI2 = Math.PI * 2;
            var material = new THREE.ParticleCanvasMaterial( {

                color: 0x41b883,
                program: function ( context ) {

                    context.beginPath();
                    context.arc( 1, 0, 1, 0, PI2, true );
                    context.fill();

                }

            } );

            var i = 0;

            for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

                for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

                    particle = particles[ i ++ ] = new THREE.Particle( material );
                    particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
                    particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
                    scene.add( particle );

                }

            }

            renderer = new THREE.CanvasRenderer();
            renderer.setSize( window.innerWidth, window.innerHeight );
            container.appendChild( renderer.domElement );

            // document.addEventListener( 'mousemove', onDocumentMouseMove, false );
            // document.addEventListener( 'touchstart', onDocumentTouchStart, false );
            // document.addEventListener( 'touchmove', onDocumentTouchMove, false );

            //

            window.addEventListener( 'resize', onWindowResize, false );

        }

        function onWindowResize() {

            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( window.innerWidth, window.innerHeight );

        }

        //

        // function onDocumentMouseMove( event ) {

        // 	mouseX = event.clientX - windowHalfX;
        // 	mouseY = event.clientY - windowHalfY;

        // }

        function onDocumentTouchStart( event ) {

            if ( event.touches.length === 1 ) {

                event.preventDefault();

                mouseX = event.touches[ 0 ].pageX - windowHalfX;
                mouseY = event.touches[ 0 ].pageY - windowHalfY;

            }

        }

        function onDocumentTouchMove( event ) {

            if ( event.touches.length === 1 ) {

                event.preventDefault();

                mouseX = event.touches[ 0 ].pageX - windowHalfX;
                mouseY = event.touches[ 0 ].pageY - windowHalfY;

            }

        }

        //

        function animate() {

            requestAnimationFrame( animate );

            render();


        }

        function render() {

            camera.position.x += ( mouseX - camera.position.x ) * .05;
            camera.position.y += ( - mouseY - camera.position.y ) * .05;
            camera.lookAt( scene.position );

            var i = 0;

            for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

                for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

                    particle = particles[ i++ ];
                    particle.position.y = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) + ( Math.sin( ( iy + count ) * 0.5 ) * 50 );
                    particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 2 + ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 2;

                }

            }

            renderer.render( scene, camera );

            count += 0.1;

        }
    },
    mounted () {


    },
    methods: {
    }
}
</script>

<style scoped>

</style>