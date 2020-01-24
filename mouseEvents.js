"use strict";

const mouseEvents = (function() {

  return {

    onMouseDown: function(event, scene, camera, raycaster, screenSize, drawingData) {

      if( event.button == 0 ) { // activation si la click gauche est enfoncé
        // Coordonnées du clic de souris
        const xPixel = event.clientX;
        const yPixel = event.clientY;

        const x =  2*xPixel/screenSize.w-1;
        const y = -2*yPixel/screenSize.h+1;

        if(drawingData.bodyMode) {
          utilsDrawing.addBody(raycaster, camera, x, y, drawingData, scene, true);
          drawingData.enableDrawing = true;
        }

        if(drawingData.finMode) {
          utilsDrawing.addFin(raycaster, camera, x, y, drawingData, scene, true);
          drawingData.enableDrawing = true;
        }

        if(drawingData.removeMode) {
          utilsDrawing.removeMesh(raycaster, camera, x, y, drawingData, scene);
        }

        if(drawingData.tornadoMode) {
          utilsDrawing.addTornadoContour(raycaster, camera, x, y, drawingData, scene);
          drawingData.enableDrawing = true;
        }

      }
    },

    onMouseMove: function( event, scene, camera, raycaster, screenSize, drawingData){
      // Coordonnées de la position de la souris

      const xPixel = event.clientX;
      const yPixel = event.clientY;

      const x =  2*xPixel/screenSize.w-1;
      const y = -2*yPixel/screenSize.h+1;

      if(drawingData.bodyMode) {
        if (drawingData.enableDrawing == true){
          utilsDrawing.addBody(raycaster, camera, x, y, drawingData, scene);
        }
      }

      if(drawingData.finMode) {
        if (drawingData.enableDrawing == true){
          utilsDrawing.addFin(raycaster, camera, x, y, drawingData, scene);
        }
      }

      if(drawingData.tornadoMode) {
        if (drawingData.enableDrawing == true){
          utilsDrawing.addTornadoContour(raycaster, camera, x, y, drawingData, scene);
        }
      }
    },

    onMouseUp: function( event, scene, camera, raycaster, screenSize, drawingData) {
      const xPixel = event.clientX;
      const yPixel = event.clientY;

      const x =  2*xPixel/screenSize.w-1;
      const y = -2*yPixel/screenSize.h+1;

      drawingData.enableDrawing = false;
      //actualisation de la position du plan de dessin
      drawingData.drawingObjects[0].quaternion.copy(camera.quaternion);

      if(drawingData.bodyMode || drawingData.finMode) {
        const epaisseur = drawingData.epaisseur;

        utilsDrawing.addMesh(scene, drawingData.drawing3DPoints, camera, drawingData, epaisseur);
        drawingData.drawing3DPoints = [];

        // on a besoin du nom du corps et de garder le corps
        if(drawingData.bodyMode){
          drawingData.body = drawingData.drawingObjects[1];
          drawingData.drawingObjects[1].name = "body";
        }

        // on agit symetriquement pour les nageoires
        if(drawingData.finMode) {
          utilsDrawing.addMesh(scene, drawingData.drawing3DPointsSym, camera, drawingData, epaisseur);
          drawingData.drawing3DPointsSym = [];
        }

        // on passe en mode nageoire apres le corps
        if(drawingData.bodyMode) {
          utilsData.enterMode(drawingData, scene, "finMode");
        }
      }

      if(drawingData.tornadoMode){
        utilsDrawing.addTornado(drawingData, scene);
      }

      // on enlève les traits de construction
      utilsData.removeLines(drawingData, scene);
    },
  };
})();
