import { DisplayObject, Rectangle } from 'pixi.js';

type BoundType = DisplayObject | Rectangle;

export function isThereCollision(a: BoundType, b: BoundType) {
    const aBounds = a instanceof DisplayObject ? a.getBounds() : a;
    const bBounds = b instanceof DisplayObject ? b.getBounds() : b;

    return (
        aBounds.x + aBounds.width > bBounds.x &&
        aBounds.x < bBounds.x + bBounds.width &&
        aBounds.y + aBounds.height > bBounds.y &&
        aBounds.y < bBounds.y + bBounds.height
    );
}
