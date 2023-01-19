import { useContext } from "react";
import { useLocation } from "react-router-dom";

import { IntricateContext } from "./IntricateContext";
import { IntricateSidebarContents } from "./IntricateSidebarContents";
import { sidebarData1, sidebarData2 } from "../../utils/intricateSidebarData";

export const IntricateSidebar = () => {
  const { intricateDatas } = useContext(IntricateContext);
  const mainPartsLists = intricateDatas
    .filter((value) => {
      return value.pairing === "main" || value.pairing === "bg";
    })
    .map((value) => {
      return value.folder;
    });
  const mainPartsDatas = mainPartsLists.map((value) => {
    return {
      title: value,
      icon: "VscSettingsGear",
      link: `/intricate/optionConfig/${value}`,
    };
  });
  const pathName = useLocation().pathname;
  const result = pathName.includes("/intricate/optionConfig");

  return (
    <>
      {sidebarData1.map((menu, index) => {
        return <IntricateSidebarContents menu={menu} key={index} />;
      })}
      {result &&
        mainPartsDatas.map((menu, index) => {
          return <IntricateSidebarContents menu={menu} key={index} />;
        })}
      {sidebarData2.map((menu, index) => {
        return <IntricateSidebarContents menu={menu} key={index} />;
      })}
    </>
  );
};
