import { animated as a, useSpring } from "@react-spring/web";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Typewriter from "typewriter-effect";
import LittleTreeLayout from "./LittleTreeLayout";
import "./styles.css";

export default function Home() {
  const navigate = useNavigate();

  const text =
    "Generate, Visualize, Explore, and Build your own Grind/Mind/Road-map with much more features";

  const bannerPs = [];
  for (let i = 0; i < 44; i++) bannerPs.push("ObsFeaRe");

  const rectangles = [useRef(), useRef(), useRef(), useRef()];

  function calculateNewIndex(currentIndex, totalRectangles) {
    const newIndex = (currentIndex % totalRectangles) + 1;
    return newIndex;
  }

  // useEffect(() => {
  //   function handleAnimationIteration(index, totalRectangles) {
  //     const rectangle = rectangles[index].current;
  //     const originalIndex = parseInt(rectangle.dataset.index);
  //     const newIndex = calculateNewIndex(originalIndex, totalRectangles);
  //     rectangle.dataset.index = newIndex;
  //     // rectangle.style.zIndex = newIndex;
  //     setTimeout(() => (rectangle.style.zIndex = newIndex), 1500);
  //   }

  //   rectangles.forEach((rectangleRef, index) => {
  //     const rectangle = rectangleRef.current;
  //     const totalRectangles = rectangles.length;
  //     rectangle.addEventListener("animationiteration", () => {
  //       handleAnimationIteration(index, totalRectangles);
  //     });
  //   });

  //   return () => {
  //     rectangles.forEach((rectangleRef) => {
  //       const rectangle = rectangleRef.current;
  //       rectangle.removeEventListener(
  //         "animationiteration",
  //         handleAnimationIteration
  //       );
  //     });
  //   };
  // }, [rectangles]);

  const animatedPropsTop = useSpring({
    from: {
      marginTop: "-40px",
      opacity: "0",
    },
    marginTop: "0",
    opacity: "100",
    config: { mass: 1, tension: 100, friction: 20 },
  });

  const animatedPropsBottom = useSpring({
    from: {
      marginBottom: "-40px",
      opacity: "0",
    },
    marginBottom: "0",
    opacity: "100",
    config: { mass: 1, tension: 100, friction: 20 },
  });

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div className="Home">
      <a.div className="InfiniteBannerTop" style={{ ...animatedPropsTop }}>
        {bannerPs.map((item) => (
          <div>
            <p>{item}</p>
          </div>
        ))}
      </a.div>
      <div className="Home-Left">
        <Typewriter
          options={{ delay: 25 }}
          onInit={(typewrite) => {
            typewrite.typeString(text).start();
          }}
        ></Typewriter>
        {/* <p>{text}</p> */}
        <button onClick={handleClick}>
          <p>Get Started</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="158"
            height="16"
            viewBox="0 0 158 16"
            fill="none"
          >
            <path
              d="M157.707 8.70709C158.098 8.31657 158.098 7.6834 157.707 7.29288L151.343 0.928919C150.953 0.538395 150.319 0.538395 149.929 0.928919C149.538 1.31944 149.538 1.95261 149.929 2.34313L155.586 7.99999L149.929 13.6568C149.538 14.0474 149.538 14.6805 149.929 15.0711C150.319 15.4616 150.953 15.4616 151.343 15.0711L157.707 8.70709ZM8.74228e-08 9L1.9625 9L1.9625 7L-8.74228e-08 7L8.74228e-08 9ZM5.8875 9L9.8125 9L9.8125 7L5.8875 7L5.8875 9ZM13.7375 9L17.6625 9L17.6625 7L13.7375 7L13.7375 9ZM21.5875 9L25.5125 9L25.5125 7L21.5875 7L21.5875 9ZM29.4375 9L33.3625 9L33.3625 7L29.4375 7L29.4375 9ZM37.2875 9L41.2125 9L41.2125 7L37.2875 7L37.2875 9ZM45.1375 9L49.0625 9L49.0625 7L45.1375 7L45.1375 9ZM52.9875 9L56.9125 9L56.9125 7L52.9875 7L52.9875 9ZM60.8375 8.99999L64.7625 8.99999L64.7625 6.99999L60.8375 6.99999L60.8375 8.99999ZM68.6875 8.99999L72.6125 8.99999L72.6125 6.99999L68.6875 6.99999L68.6875 8.99999ZM76.5375 8.99999L80.4625 8.99999L80.4625 6.99999L76.5375 6.99999L76.5375 8.99999ZM84.3875 8.99999L88.3125 8.99999L88.3125 6.99999L84.3875 6.99999L84.3875 8.99999ZM92.2375 8.99999L96.1625 8.99999L96.1625 6.99999L92.2375 6.99999L92.2375 8.99999ZM100.088 8.99999L104.013 8.99999L104.013 6.99999L100.088 6.99999L100.088 8.99999ZM107.938 8.99999L111.863 8.99999L111.863 6.99999L107.938 6.99999L107.938 8.99999ZM115.788 8.99999L119.713 8.99999L119.713 6.99999L115.788 6.99999L115.788 8.99999ZM123.638 8.99999L127.563 8.99999L127.563 6.99999L123.638 6.99999L123.638 8.99999ZM131.488 8.99999L135.413 8.99999L135.413 6.99999L131.488 6.99999L131.488 8.99999ZM139.338 8.99999L143.263 8.99999L143.263 6.99999L139.338 6.99999L139.338 8.99999ZM147.188 8.99999L151.113 8.99999L151.113 6.99999L147.188 6.99999L147.188 8.99999ZM155.038 8.99999L157 8.99999L157 6.99999L155.038 6.99999L155.038 8.99999Z"
              fill="black"
            />
          </svg>
        </button>
      </div>
      <div className="Home-Right-Blur"></div>
      <div className="Home-Right">
        <div className="greenRect" ref={rectangles[0]} data-index="1"></div>
        <div className="yellowRect" ref={rectangles[1]} data-index="2"></div>
        <div className="blueRect" ref={rectangles[2]} data-index="3"></div>
        <div className="orangeRect" ref={rectangles[3]} data-index="4"></div>
      </div>
      <div className="LittlePlayGround">
        <LittleTreeLayout></LittleTreeLayout>
      </div>
      <a.div
        className="InfiniteBannerBottom"
        style={{ ...animatedPropsBottom }}
      >
        {bannerPs.map((item) => (
          <div>
            <p>{item}</p>
          </div>
        ))}
      </a.div>
    </div>
  );
}
