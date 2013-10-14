/*

  En el anterior prototipo (06-player), el objeto Game permite
  gestionar una colección de tableros (boards). Los tres campos de
  estrellas, la pantalla de inicio, y el sprite de la nave del
  jugador, se añaden como tableros independientes para que Game pueda
  ejecutar sus métodos step() y draw() periódicamente desde su método
  loop(). Sin embargo los objetos que muestran los tableros no pueden
  interaccionar entre sí. Aunque se añadiesen nuevos tableros para los
  misiles y para los enemigos, resulta difícil con esta arquitectura
  pensar en cómo podría por ejemplo detectarse la colisión de una nave
  enemiga con la nave del jugador, o cómo podría detectarse si un
  misil disparado por la nave del usuario ha colisionado con una nave
  enemiga.


  Requisitos:

  Este es precisamente el requisito que se ha identificado para este
  prototipo: diseñar e implementar un mecanismo que permita gestionar
  la interacción entre los elementos del juego. Para ello se diseñará
  la clase GameBoard. Piensa en esta clase como un tablero de un juego
  de mesa, sobre el que se disponen los elementos del juego (fichas,
  cartas, etc.). En Alien Invasion los elementos del juego serán las
  naves enemigas, la nave del jugador y los misiles. Para el objeto
  Game, GameBoard será un board más, por lo que deberá ofrecer los
  métodos step() y draw(), siendo responsable de mostrar todos los
  objetos que contenga cuando Game llame a estos métodos.

  Este prototipo no añade funcionalidad nueva a la que ofrecía el
  prototipo 06.


  Especificación: GameBoard debe

  - mantener una colección a la que se pueden añadir y de la que se
    pueden eliminar sprites como nave enemiga, misil, nave del
    jugador, explosión, etc.

  - interacción con Game: cuando Game llame a los métodos step() y
    draw() de un GameBoard que haya sido añadido como un board a Game,
    GameBoard debe ocuparse de que se ejecuten los métodos step() y
    draw() de todos los objetos que contenga

  - debe ofrecer la posibilidad de detectar la colisión entre
    objetos. Un objeto sprite almacenado en GameBoard debe poder
    detectar si ha colisionado con otro objeto del mismo
    GameBoard. Los misiles disparados por la nave del jugador deberán
    poder detectar gracias a esta funcionalidad ofrecida por GameBoard
    cuándo han colisionado con una nave enemiga; una nave enemiga debe
    poder detectar si ha colisionado con la nave del jugador; un misil
    disparado por la nave enemiga debe poder detectar si ha
    colisionado con la nave del jugador. Para ello es necesario que se
    pueda identificar de qué tipo es cada objeto sprite almacenado en
    el tablero de juegos, pues cada objeto sólo quiere comprobar si ha
    colisionado con objetos de cierto tipo, no con todos los objetos.

*/

describe("GameBoard", function(){
	
	var canvas, ctx;

    beforeEach(function(){
	loadFixtures('index.html');

	canvas = $('#game')[0];
	expect(canvas).toExist();

	ctx = canvas.getContext('2d');
	expect(ctx).toBeDefined();

    });

	var game= new GameBoard();
	it("GameBoard add", function(){
		expect(game.add("5")).toEqual(game.objects[0]);
	});

	it("GameBoard removed", function(){
		game.resetRemoved();
		game.remove("5");
		expect("5").toEqual(game.removed[0]);
		game.finalizeRemoved("5");
		expect(game.objects).toEqual([]);
	});
	it("GameBoard overlap", function(){
		 var object= function (x, y, w, h){
			this.x=x;
			this.y=y;
			this.w=w;
			this.h=h;
		};
		var object1= new object(10,11,3,4);
		var object2= new object(10,10,3,4);
		var object3= new object (7,8,3,10);
		expect(game.overlap(object1,object2)).toBe(true);
		expect(game.overlap(object1,object3)).toBe(false);
	});	

	it("GameBoard step", function(){
		spyOn(game, "step");
		game.step("5");
		//wait(200)
		//runs (function(){
			expect(game.step).toHaveBeenCalled();
		//});	
	});
	
	it("GameBoard draw", function(){
		spyOn(game, "draw");
		game.draw("ctx");
		expect(game.draw).toHaveBeenCalled();
	});
	it("GameBoard collide", function(){
		 var object= function ( x, y, w, h, type){
			this.type=type;
			this.x=x;
			this.y=y;
			this.w=w;
			this.h=h;
		};
		var object1= new object(10,11,3,4, "1");
		var object3= new object(10,10,3,4, "2");
		var object2= new object( 7, 8, 3, 10);
		
		//game.add(object1);
		//game.add(object3);
		
		//alert(game.objects);
		spyOn(game, "collide");
		
		expect(game.collide(object2)).toBe(game.objects[2]);
		expect(game.collide(object2,"1")).toBeFalsy();
	});
	
	it("GameBoard underscore iterate", function(){
		var dummy1= new function(){
			this.iter= function(){};
		};
		var dummy2= new function(){
			this.iter= function(){};
		};
		
		game.add(dummy1);
		game.add(dummy2);
		
		spyOn(dummy1,"iter");
		spyOn(dummy2,"iter");
		
		game.iterate("iter");
		_.each(game.objects,function(elem){expect(elem.iter).toHaveBeenCalled()});
	});
	
});
