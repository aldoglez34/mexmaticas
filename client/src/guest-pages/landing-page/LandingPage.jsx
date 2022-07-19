import React, { useEffect } from "react";
import { StudentLayout } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { clearAdminData } from "../../redux/actions/admin";
import { clearPurchase } from "../../redux/actions/purchase";
import { clearExam } from "../../redux/actions/exam";
import { clearCourse } from "../../redux/actions/course";
import {
  FAQJumbotron,
  OurCourses,
  ThreeColumns,
  WelcomeJumbotron,
} from "./sections";

export const LandingPage = () => {
  const dispatch = useDispatch();

  const adminData = useSelector((state) => state.admin);
  const purchase = useSelector((state) => state.purchase);
  const exam = useSelector((state) => state.exam);
  const course = useSelector((state) => state.course);

  useEffect(() => {
    if (adminData) dispatch(clearAdminData());
    if (purchase) dispatch(clearPurchase());
    if (exam) dispatch(clearExam());
    if (course) dispatch(clearCourse());
  }, [adminData, course, dispatch, exam, purchase]);

  return (
    <StudentLayout hasScrollButton isContainer={false}>
      <WelcomeJumbotron />
      <ThreeColumns />
      <OurCourses />
      <FAQJumbotron />
    </StudentLayout>
  );
};
