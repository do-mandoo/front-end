import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import createRequestSaga from '../lib/createRequestSaga';
import * as API from '../lib/api/auth';
import { takeLatest } from 'redux-saga/effects';

const RESERVE_CONFIRM = 'user/RESERVE_CONFIRM';
const RESERVE_CONFIRM_SUCCESS = 'user/RESERVE_CONFIRM_SUCCESS';
const RESERVE_CONFIRM_FAILURE = 'user/RESERVE_CONFIRM_FAILURE';

// 유저 정보

const USER_INFO = 'user/USER_INFO';
const USER_INFO_SUCCESS = 'user/USER_INFO_SUCCESS';

// 유저 정보 수정
const CHANGE_INPUT_PERSON_SUBMIT = 'user/CHANGE_INPUT_PERSON_SUBMIT';
const CHANGE_INPUT_PERSON_SUBMIT_SUCCESS = 'user/CHANGE_INPUT_PERSON_SUBMIT';
const CHANGE_INPUT_PERSON_SUBMIT_FAILURE = 'user/CHANGE_INPUT_PERSON_SUBMIT';

const CHANGE_INPUT_PERSON = 'user/CHANGE_INPUT_PERSON';
const CHANGE_INPUT_IMG_PERSON = 'user/CHANGE_INPUT_IMG_PERSON';

// 예약 취소
const RESERVATION_CANCEL = 'user/RESERVATION_CANCEL';
const RESERVATION_CANCEL_SUCCESS = 'user/RESERVATION_CANCEL_SUCCESS';
const RESERVATION_CANCEL_FAILURE = 'user/RESERVATION_CANCEL_FAILURE';

// 후기 작성 action type 모음집
const CHANGE_INPUT_REVIEW = 'user/CHANGE_INPUT_REVIEW';
const CHANGE_INPUT_STAR_RATING = 'user/CHANGE_INPUT_STAR_RATING';
const INITIAL_INPUT_REVIEW = 'user/INITIAL_INPUT_REVIEW';

// 후기 작성 비동기 action type
const REVIEW = 'user/REVIEW';
const REVIEW_SUCCESS = 'user/REVIEW_SUCCESS';
const REVIEW_FAILURE = 'user/REVIEW_FAILURE';

// 유저의 숙소 삭제
export const reservationCancel = createAction(
  RESERVATION_CANCEL,
  ({ token, reservationId, name, reason }) => ({
    token,
    reservationId,
    name,
    reason,
  }),
);

export const userInfo = createAction(USER_INFO, (token) => token);

export const changeInputImgPerson = createAction(
  CHANGE_INPUT_IMG_PERSON,
  (name, value) => ({
    name,
    value,
  }),
);

export const changeInputPersonSubmit = createAction(
  CHANGE_INPUT_PERSON_SUBMIT,
  (token, name, value) => ({ token, [name]: value }),
);

export const reserveConfirm = createAction(RESERVE_CONFIRM, ({ token }) => ({
  token,
}));

export const changeInputPerson = createAction(
  CHANGE_INPUT_PERSON,
  (name, value) => ({
    name,
    value,
  }),
);

// 후기 작성 action type 모음집
export const changeInputReview = createAction(
  CHANGE_INPUT_REVIEW,
  (value) => value,
);

export const changeInputStarRating = createAction(
  CHANGE_INPUT_STAR_RATING,
  ({
    cleanliness,
    accuracy,
    communication,
    locationRate,
    checkIn,
    priceSatisfaction,
  }) => ({
    cleanliness,
    accuracy,
    communication,
    locationRate,
    checkIn,
    priceSatisfaction,
  }),
);

export const initialInputReview = createAction(INITIAL_INPUT_REVIEW);

// 후기 작성 비동기 action create function
export const review = createAction(
  REVIEW,
  (
    token,
    reservationId,
    cleanliness,
    accuracy,
    communication,
    locationRate,
    checkIn,
    priceSatisfaction,
    description,
  ) => ({
    token,
    reservationId,
    cleanliness,
    accuracy,
    communication,
    locationRate,
    checkIn,
    priceSatisfaction,
    description,
  }),
);

const initialState = {
  userRes: {
    name: '',
    email: '',
    birth: '',
    imageUrl: '',
  },
  reserveRes: [],
  reserveCancelRes: [],
  reserveReviewReq: {
    description: '',
  },
  reserveReiewRes: [],
  reserveError: null,
  reserveReviewError: null,
};

const user = handleActions(
  {
    [RESERVE_CONFIRM_SUCCESS]: (state, action) => {
      sessionStorage.setItem(
        'userInfoConFirm',
        JSON.stringify(
          action.payload._embedded.reservationConfirmedResponseList,
        ),
      );
      return produce(state, (draft) => {
        draft.reserveRes =
          action.payload._embedded.reservationConfirmedResponseList;
      });
    },
    [RESERVE_CONFIRM_FAILURE]: (state, action) => ({
      ...initialState,
      reserveError: action.payload.error,
    }),
    [USER_INFO_SUCCESS]: (state, { payload }) => {
      console.log(payload);
      sessionStorage.setItem('userInfo', JSON.stringify(payload));
      return produce(state, (draft) => {
        draft.userRes = payload;
      });
    },
    [CHANGE_INPUT_PERSON]: (state, { payload }) => {
      return produce(state, (draft) => {
        draft.userRes[payload.name] = payload.value;
      });
    },
    [CHANGE_INPUT_IMG_PERSON]: (state, { payload }) => {
      sessionStorage.setItem('userInfoImg', JSON.stringify(payload.value));

      return produce(state, (draft) => {
        draft.userRes.imageUrl = payload.value;
      });
    },
    [CHANGE_INPUT_PERSON_SUBMIT_SUCCESS]: (
      state,
      { payload: { name, birth, email } },
    ) => {
      return produce(state, (draft) => {
        draft.userRes.name = name;
        draft.userRes.birth = birth;
        draft.userRes.email = email;
      });
    },
    [RESERVATION_CANCEL_SUCCESS]: (state, { payload }) => {
      return produce(state, (draft) => {
        draft.userRes.reserveCancelRes = payload;
      });
    },
    [RESERVATION_CANCEL_FAILURE]: (state, { payload }) => {
      return produce(state, (draft) => {
        draft.reserveError = payload;
      });
    },

    // 후기 작성 reducer
    [CHANGE_INPUT_REVIEW]: (state, { payload: description }) => ({
      ...state,
      reserveReviewReq: { ...state.reserveReviewReq, description },
    }),
    [CHANGE_INPUT_STAR_RATING]: (state, { payload: ratingStar }) =>
      produce(state, (draft) => {
        draft.reserveReviewReq.ratingStar = ratingStar;
      }),
    [INITIAL_INPUT_REVIEW]: (state, _) => ({
      ...state,
      reserveReviewReq: { ...state.reserveReviewReq, description: '' },
    }),
    [REVIEW_SUCCESS]: (state, _) => {
      // 후기 작성한 방 localStorage에 저장해서 다시 후기 작성하는 button 막기
      const roomId = localStorage.getItem('completeReviewRoomId');

      return {
        ...state,
        reserveReiewRes: [...state.reserveReiewRes, roomId],
      };
    },
    [REVIEW_FAILURE]: (state, { payload: reserveReviewError }) => ({
      ...state,
      reserveReviewError,
    }),
  },
  initialState,
);

export default user;

// saga

const reserveConfirmSaga = createRequestSaga(RESERVE_CONFIRM, (token) =>
  API.userReservation(token),
);

const userConfirmSaga = createRequestSaga(USER_INFO, (token) =>
  API.userMe(token),
);

// 유저 수정

const changeInputPersonSaga = createRequestSaga(
  CHANGE_INPUT_PERSON_SUBMIT,
  (token, name = null, email = null, birth = null) =>
    API.userInfoRemake(token, name, email, birth),
);

const reserveCancel = createRequestSaga(
  RESERVATION_CANCEL,
  (token, reservationId, name, reason) =>
    API.reserveCancel(token, reservationId, name, reason),
);

// 리뷰 작성

const reviewSaga = createRequestSaga(REVIEW, API.writeReview);

export function* userSaga() {
  yield takeLatest(RESERVE_CONFIRM, reserveConfirmSaga);
  yield takeLatest(USER_INFO, userConfirmSaga);
  yield takeLatest(RESERVATION_CANCEL, reserveCancel);
  yield takeLatest(CHANGE_INPUT_PERSON_SUBMIT, changeInputPersonSaga);
  yield takeLatest(REVIEW, reviewSaga);
}
