// import { ChatRoomComponent } from "../app/ChatRoomComponent";
import InternalStore from "../app/InternalStore";
test("test", () => {
    expect(InternalStore.config).toBeUndefined();
});
test("test dataManager", () => {
    expect(InternalStore.dataManager).toBeDefined();
});
