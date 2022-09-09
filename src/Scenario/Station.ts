// import { Bounds, Container, DisplayObject, Graphics } from 'pixi.js';
// import { Keyboard, KeyState } from '../keyboard';
// import { IScene, ISceneObject } from '../manager';
// import { Vector } from '../math/Vector';
// import { Key } from 'ts-key-enum';

// export class Station implements ISceneObject {
//     private graphics = new Graphics();
//     private container = new Container();
//     private shelfSize: number;

//     position: Vector;

//     constructor(x: number, y: number, shelfSize: number) {
//         this.position = new Vector(x, y);
//         this.shelfSize = shelfSize;
//         this.buildGraphics();
//     }

//     buildGraphics() {
//         this.graphics.beginFill(0x0000ff);
//         this.graphics.drawRect(
//             this.position.x,
//             this.position.y,
//             this.shelfSize * 3,
//             this.shelfSize
//         );
//         this.graphics.endFill();
//         this.container.addChild(this.graphics);
//     }

//     update(deltaTime: number): void {}

//     subscribe(subscribeCb: (object: DisplayObject) => void): void {
//         subscribeCb(this.container);
//     }
// }
