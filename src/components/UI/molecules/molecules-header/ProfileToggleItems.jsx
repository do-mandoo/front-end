import React, { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { logout } from '../../../../modules/auth';

const ProfileToggleItemUl = styled.ul`
  list-style: none;
  width: fit-content;
  padding: 5px 0 5px;
  margin: 0;
  border-radius: 10px;
  display: flex;
  flex-flow: column;
  align-self: start;
  justify-content: space-around;
  box-shadow: 1px 1px 6px 0px rgba(0, 0, 0, 0.49);

  background-color: white;
  .login {
    font-weight: 600;
  }
`;

const ProfileToggleItemLi = styled.li`
  width: 220px;
  height: 35px;
  line-height: 35px;
  padding-left: 20px;
  text-align: left;
  font-size: 14px;

  cursor: pointer;
  &:hover {
    background: #f7f7f7;
  }
`;

const ProfileToggleItems = ({
  isOpen,
  setIsOpen,
  formState,
  setFormState,
  token,
  dispatch,
  reservationClick,
  userInfoClick,
  modal,
  setModal,
}) => {
  const history = useHistory();

  const displayLoginModal = (e) => {
    e.preventDefault();

    setFormState('login');
    setModal(true);
    setIsOpen(false);
  };

  const displayRegisterModal = (e) => {
    e.preventDefault();

    setFormState('register');
    setModal(true);
    setIsOpen(false);
  };

  const clickOutside = (e) => {
    // 모달 창의 내부를 클릭한게 아니라면 창을 닫아주는 함수
    // 로그인/회원가입 모달이 열려있지 않고, 프로필 아래의 토글 모달영역 내부가 아닐때.
    if (isOpen && !modal)
      if (
        e.target.matches('.profile-toggle-modal > li') ||
        e.target.matches('.profile-toggle-modal')
      ) {
        return;
      } else if (
        e.target.closest('form') &&
        e.target.closest('form').className === 'auth-modal-form'
      ) {
        return;
      }

    setIsOpen(false);
  };

  // 로그아웃 함수
  const requestLogOut = () => {
    console.log(history);
    dispatch(logout());
    setIsOpen(false);
    if (
      history.location.pathname === '/reserveconfirm' ||
      history.location.pathname === '/personInfo'
    ) {
      history.replace('/');
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    window.addEventListener('click', clickOutside);

    return () => {
      window.removeEventListener('click', clickOutside);
    };
  }, []);

  return (
    <>
      <ProfileToggleItemUl className="profile-toggle-modal">
        {!token && (
          <>
            <ProfileToggleItemLi onClick={displayLoginModal} className="login">
              로그인
            </ProfileToggleItemLi>
            <ProfileToggleItemLi
              onClick={displayRegisterModal}
              className="register"
            >
              회원가입
            </ProfileToggleItemLi>
          </>
        )}
        {token && (
          <>
            <ProfileToggleItemLi onClick={reservationClick}>
              예약 내역
            </ProfileToggleItemLi>
            <ProfileToggleItemLi onClick={userInfoClick}>
              계정
            </ProfileToggleItemLi>
            <ProfileToggleItemLi onClick={requestLogOut}>
              로그 아웃
            </ProfileToggleItemLi>
          </>
        )}
      </ProfileToggleItemUl>
    </>
  );
};

export default ProfileToggleItems;
