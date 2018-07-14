// import { ChatRoomComponent } from "../app/ChatRoomComponent";
import InternalStore from "../app/InternalStore";
test("test", function () {
    expect(InternalStore.config).toBeUndefined();
});
test("test dataManager", function () {
    expect(InternalStore.dataManager).toBeDefined();
});
