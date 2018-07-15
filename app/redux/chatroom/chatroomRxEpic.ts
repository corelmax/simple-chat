/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
import { createAction } from "redux-actions";
import * as Rx from "rxjs/Rx";
import { ChatRoomComponent } from "../../ChatRoomComponent";
import InternalStore from "../../InternalStore";
import { MessageImp } from "../../models";
import { FileResult } from "../../models/FileResult";
import * as chatroomService from "../../services/ChatroomService";
import { updateMessagesReader } from "../../services/MessageService";
import { apiHeaders } from "../../services/ServiceUtils";
import {
    checkOlderMessages, GET_NEWER_MESSAGE_SUCCESS, getNewerMessageFromNet,
} from "./chatroomActions";

const apiConfig = () => InternalStore.apiConfig;
const authReducer = () => InternalStore.authStore;
const getStore = () => InternalStore.store;

const { ajax, fromPromise } = Rx.Observable;

export const FETCH_PRIVATE_CHATROOM = "FETCH_PRIVATE_CHATROOM";
export const FETCH_PRIVATE_CHATROOM_FAILURE = "FETCH_PRIVATE_CHATROOM_FAILURE";
export const FETCH_PRIVATE_CHATROOM_SUCCESS = "FETCH_PRIVATE_CHATROOM_SUCCESS";
export const FETCH_PRIVATE_CHATROOM_CANCELLED = "FETCH_PRIVATE_CHATROOM_CANCELLED";

export const fetchPrivateChatRoom = (ownerId: string, roommateId: string) =>
    ({ type: FETCH_PRIVATE_CHATROOM, payload: { ownerId, roommateId } });
const fetchPrivateChatRoomSuccess = (payload: any) => ({ type: FETCH_PRIVATE_CHATROOM_SUCCESS, payload });
const cancelFetchPrivateChatRoom = () => ({ type: FETCH_PRIVATE_CHATROOM_CANCELLED });
const fetchPrivateChatRoomFailure = (payload: any) => ({ type: FETCH_PRIVATE_CHATROOM_FAILURE, payload });
export const getPrivateChatRoomEpic = (action$) =>
    action$.ofType(FETCH_PRIVATE_CHATROOM)
        .mergeMap((action) =>
            fromPromise(chatroomService.getPrivateChatroom(action.payload.ownerId, action.payload.roommateId)))
        .mergeMap((response) => fromPromise(response.json()))
        .map((json) => {
            if (json.success) {
                return fetchPrivateChatRoomSuccess(json.result[0]);
            } else {
                return fetchPrivateChatRoomFailure(json.message);
            }
        })._do((x) => {
            if (x.type === FETCH_PRIVATE_CHATROOM_FAILURE) {
                console.warn("Need to create private chat room!");
            }
        })
        .takeUntil(action$.ofType(FETCH_PRIVATE_CHATROOM_CANCELLED))
        .catch((error) => Rx.Observable.of(fetchPrivateChatRoomFailure(error.message)));

export const CREATE_PRIVATE_CHATROOM = "CREATE_PRIVATE_CHATROOM";
export const CREATE_PRIVATE_CHATROOM_SUCCESS = "CREATE_PRIVATE_CHATROOM_SUCCESS";
export const CREATE_PRIVATE_CHATROOM_CANCELLED = "CREATE_PRIVATE_CHATROOM_CANCELLED";
export const CREATE_PRIVATE_CHATROOM_FAILURE = "CREATE_PRIVATE_CHATROOM_FAILURE";

export const createPrivateChatRoom = (owner, roommate) => ({
    type: CREATE_PRIVATE_CHATROOM,
    payload: { owner, roommate },
});
const createPrivateChatRoomSuccess = (payload) => ({ type: CREATE_PRIVATE_CHATROOM_SUCCESS, payload });
const createPrivateRoomCancelled = () => ({ type: CREATE_PRIVATE_CHATROOM_CANCELLED });
const createPrivateChatRoomFailure = (payload) => ({ type: CREATE_PRIVATE_CHATROOM_FAILURE, payload });

export const createPrivateChatRoomEpic = (action$) => {
    return action$.ofType(CREATE_PRIVATE_CHATROOM)
        .mergeMap((action) => ajax({
            method: "POST",
            url: `${InternalStore.apiConfig.api}/chatroom/private_chat/create`,
            body: action.payload,
            headers: apiHeaders(),
            // headers: {
            //     "Content-Type": "application/json",
            //     "x-access-token": authReducer().chitchat_token
            // }
        }))
        .map((json) => createPrivateChatRoomSuccess(json.response))
        .takeUntil(action$.ofType(CREATE_PRIVATE_CHATROOM_CANCELLED))
        .catch((error) => Rx.Observable.of(createPrivateChatRoomFailure(error.xhr.response)));
};

export const GET_MY_ROOM = "GET_MY_ROOM";
export const GET_MY_ROOM_SUCCESS = "GET_MY_ROOM_SUCCESS";
export const GET_MY_ROOM_FAILURE = "GET_MY_ROOM_FAILURE";
export const getMyRoom = createAction(GET_MY_ROOM,
    (userId: string, username: string, avatar: string) => ({
        userId, username, avatar,
    }));
export const getMyRoomSuccess = createAction(GET_MY_ROOM_SUCCESS, (payload) => payload);
export const getMyRoomFailure = createAction(GET_MY_ROOM_FAILURE, (error) => error);
export const getMyRoomEpic = (action$) => {
    return action$.ofType(GET_MY_ROOM)
        .mergeMap((action) => ajax({
            method: "GET",
            url: `${InternalStore.apiConfig.chatroom}
            /myroom?user_id=${action.payload.user_id}
            &username=${action.payload.username}
            &avatar=${action.payload.avatar}`,
            headers: apiHeaders(),
        }))
        .map((json) => getMyRoomSuccess(json.response.result[0]))
        .catch((error) => Rx.Observable.of(getMyRoomFailure(error)));
};

const GET_PERSISTEND_MESSAGE = "GET_PERSISTEND_MESSAGE";
const GET_PERSISTEND_MESSAGE_CANCELLED = "GET_PERSISTEND_MESSAGE_CANCELLED";
export const GET_PERSISTEND_MESSAGE_SUCCESS = "GET_PERSISTEND_MESSAGE_SUCCESS";
const GET_PERSISTEND_MESSAGE_FAILURE = "GET_PERSISTEND_MESSAGE_FAILURE";

const getPersistendMessageRequest = createAction(GET_PERSISTEND_MESSAGE, (paylaod: string) => paylaod);
const getPersistendMessageCancel = createAction(GET_PERSISTEND_MESSAGE_CANCELLED);
const getPersistendMessageSuccess = createAction(GET_PERSISTEND_MESSAGE_SUCCESS, (payload: any) => payload);
const getPersistendMessageFailure = createAction(GET_PERSISTEND_MESSAGE_FAILURE, (error: any) => error);

export const getPersistendMessage = async (roomId: string) => {
    getStore().dispatch(getPersistendMessageRequest(roomId));

    try {
        const result = await ChatRoomComponent.getInstance().getPersistentMessage(roomId);
        getStore().dispatch(getPersistendMessageSuccess(result));
        checkOlderMessages();
        getNewerMessageFromNet();
    } catch (ex) {
        getStore().dispatch(getPersistendMessageFailure(ex.message));
    }
};

export const UPDATE_MESSAGES_READ = "UPDATE_MESSAGES_READ";
export const UPDATE_MESSAGES_READ_SUCCESS = "UPDATE_MESSAGES_READ_SUCCESS";
export const UPDATE_MESSAGES_READ_FAILUER = "UPDATE_MESSAGES_READ_FAILURE";

export const updateMessagesRead = createAction(UPDATE_MESSAGES_READ,
    (messages: MessageImp[], roomId: string) => ({ messages, roomId }));
export const updateMessagesReadSuccess = createAction(UPDATE_MESSAGES_READ_SUCCESS, (payload) => payload);
export const updateMessagesReadFailure = createAction(UPDATE_MESSAGES_READ_FAILUER, (payload) => payload);

export const updateMessagesReadEpic = (action$) => {
    return action$.ofType(UPDATE_MESSAGES_READ)
        .mergeMap((action) => {
            const messages = action.payload.messages as MessageImp[];
            const updates = messages.map((value) => {
                if (value.sender !== authReducer().user._id) {
                    return value._id;
                }
            }) as string[];

            return updateMessagesReader(updates, action.payload.room_id);
        })
        .mergeMap((response) => response.json())
        .map((json) => {
            if (json.success) {
                return updateMessagesReadSuccess(json);
            } else { return updateMessagesReadFailure(json.message); }
        })
        .catch((error) => Rx.Observable.of(updateMessagesReadFailure(error)));
};

export const CHATROOM_UPLOAD_FILE = "CHATROOM_UPLOAD_FILE";
export const CHATROOM_UPLOAD_FILE_SUCCESS = "CHATROOM_UPLOAD_FILE_SUCCESS";
export const CHATROOM_UPLOAD_FILE_FAILURE = "CHATROOM_UPLOAD_FILE_FAILURE";
export const CHATROOM_UPLOAD_FILE_CANCELLED = "CHATROOM_UPLOAD_FILE_CANCELLED";

export const uploadFile = (progressEvent: ProgressEvent, file) =>
    ({ type: CHATROOM_UPLOAD_FILE, payload: { data: progressEvent, file } });
const uploadFileSuccess = (result: FileResult) => ({ type: CHATROOM_UPLOAD_FILE_SUCCESS, payload: result });
const uploadFileFailure = (error) => ({ type: CHATROOM_UPLOAD_FILE_FAILURE, payload: error });
export const uploadFileCanceled = () => ({ type: CHATROOM_UPLOAD_FILE_CANCELLED });
export const uploadFileEpic = (action$) => (
    action$.ofType(CHATROOM_UPLOAD_FILE)
        .mergeMap((action) => {
            const body = new FormData();
            body.append("file", action.payload.file);

            return ajax({
                method: "POST",
                url: `${apiConfig().fileUpload}`,
                body,
                headers: {},
            });
        })
        .map((json) => uploadFileSuccess(json.response))
        .takeUntil(action$.ofType(CHATROOM_UPLOAD_FILE_CANCELLED))
        .catch((error) => Rx.Observable.of(uploadFileFailure(error.xhr.response)))
);
