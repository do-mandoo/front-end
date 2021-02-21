import React from 'react';
import { useSelector } from 'react-redux';
import HeaderDetailScrolled from '../../components/UI/organisms/organisms-header/HeaderDetailScrolled';

const HeaderDetailScrolledContainer = ({
  showButton,
  reviewRef,
  facilityRef,
  DetailHeaderRef,
  formState,
  setFormState,
  modal,
  setModal,
  bookingInfoRef,
  isCalendarOpen,
  setIsCalendarOpen,
}) => {
  const { startDate, endDate } = useSelector((state) => state.detail);

  const scrollToHandler = (Ycoord) => {
    window.scrollTo({ top: Ycoord, behavior: 'smooth' }); // 전달받은 y 좌표로 스크롤 이동
  };

  const scrollToElement = (elem) => {
    elem.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <HeaderDetailScrolled
      showButton={!showButton}
      scrollToHandler={scrollToHandler}
      scrollToElement={scrollToElement}
      reviewRef={reviewRef}
      facilityRef={facilityRef}
      DetailHeaderRef={DetailHeaderRef}
      formState={formState}
      setFormState={setFormState}
      modal={modal}
      setModal={setModal}
      startDate={startDate}
      endDate={endDate}
      bookingInfoRef={bookingInfoRef}
      isCalendarOpen={isCalendarOpen}
      setIsCalendarOpen={setIsCalendarOpen}
    />
  );
};

export default HeaderDetailScrolledContainer;
