export enum KeyState {
    UNPRESSED,
    PRESSED
}

export class Keyboard {
    public static readonly state: Map<string, KeyState>;
    
    public static initialize() {
        document.addEventListener("keydown", Keyboard.keyDown);
        document.addEventListener("keyup", Keyboard.keyUp);
    }
    
    private static keyDown(e: KeyboardEvent): void {
        Keyboard.state.set(e.code, KeyState.PRESSED);
    }
    
    private static keyUp(e: KeyboardEvent): void {
        Keyboard.state.set(e.code, KeyState.UNPRESSED);
    }
}