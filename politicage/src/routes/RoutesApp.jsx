import { Fragment } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ConjunctionForm } from "../components/ConjunctionForm";
import { Home } from "../components/home";

const Private = ({Item}) => {
  const signed = true;

  return signed ? <Item /> : <Navigate to="/" replace />;
}

export function RoutesApp(){

  return (
    <BrowserRouter>
    <Fragment>
      <Routes>
        <Route exact path="/" element={<ConjunctionForm/>}/>
        <Route exact path="/home" element={<Private Item={Home}/>}/>
        <Route path="*" element={<ConjunctionForm/>} />
      </Routes>
    </Fragment>
    </BrowserRouter>
  )
}
