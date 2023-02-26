import { useContext, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

import { BlueprintData, SubData } from "../../schema/blueprintData";
import { EditModal } from "./EditModal";
import { BlueprintContext } from "./BlueprintContext";
import { changeTableHeader } from "../../schema/tableHeader";

import "./style.css";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

type Props = {
  switchingDisplay: boolean;
};

type SortItem = {
  item: string | number;
  order: "asc" | "desc";
};

export const BlueprintTable: React.FC<Props> = ({ switchingDisplay }) => {
  const { blueprintDatas, setEditData, setBlueprintDatas, deleteData, exData } =
    useContext(BlueprintContext);

  //ソート機能
  const [sortItem, setSortItem] = useState<SortItem>({
    item: "",
    order: "asc",
  });

  const sortData = (sort: string | number) => {
    if (sortItem.order === "asc") {
      const sorted = [
        ...blueprintDatas.sort((a, b) => (a[sort] > b[sort] ? 1 : -1)),
      ];
      setBlueprintDatas(sorted);
      setSortItem({ item: sort, order: "desc" });
    } else if (sortItem.order === "desc") {
      const sorted = [
        ...blueprintDatas.sort((a, b) => (a[sort] < b[sort] ? 1 : -1)),
      ];
      setBlueprintDatas(sorted);
      setSortItem({ item: sort, order: "asc" });
    }
  };

  const objectValue = (objectDatas: SubData[], key: string): string => {
    const target = objectDatas.find((subData) => subData.attribute === key);
    if (target === undefined) {
      return "";
    } else return target.value;
  };

  const sortSubData = (sort: string) => {
    if (sortItem.order === "asc") {
      const sorted = [
        ...blueprintDatas.sort((a, b) =>
          objectValue(a.subDatas, sort) > objectValue(b.subDatas, sort) ? 1 : -1
        ),
      ];
      setBlueprintDatas(sorted);
      setSortItem({ item: sort, order: "desc" });
    } else if (sortItem.order === "desc") {
      const sorted = [
        ...blueprintDatas.sort((a, b) =>
          objectValue(a.subDatas, sort) < objectValue(b.subDatas, sort) ? 1 : -1
        ),
      ];
      setBlueprintDatas(sorted);
      setSortItem({ item: sort, order: "asc" });
    }
  };

  //編集画面の呼出し
  const [modalShow, setModalShow] = useState(false);
  const openEditScreen = (data: BlueprintData) => {
    setEditData(data);
    setModalShow(true);
  };

  //herder切替
  const header = changeTableHeader(!switchingDisplay);

  return (
    <Container fluid className="px-5">
      <div
        className="table-responsive"
        style={{ height: "72vh", border: "groove" }}
      >
        <table className="table table-Light table-hover text-center fs-5 table-bordered border-light sticky_table">
          <thead className="table-light sticky-top bg-white">
            <tr>
              {header.map((value) => {
                return (
                  <th onClick={() => sortData(value)} key={value}>
                    {value}
                    <span>
                      {sortItem.item === value
                        ? sortItem.order === "desc"
                          ? "🔽"
                          : "🔼"
                        : ""}
                    </span>
                  </th>
                );
              })}

              {exData.map((value) => {
                return (
                  <th onClick={() => sortSubData(value)} key={value}>
                    {value}
                    <span>
                      {sortItem.item === value
                        ? sortItem.order === "desc"
                          ? "🔽"
                          : "🔼"
                        : ""}
                    </span>
                  </th>
                );
              })}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {blueprintDatas.map((blueprintData, index) => {
              return (
                <tr key={index}>
                  {header.map((value, index) => {
                    if (index === 0) {
                      return (
                        <th
                          onClick={() => {
                            openEditScreen(blueprintData);
                          }}
                          key={value}
                        >
                          {blueprintData[value]}
                        </th>
                      );
                    }
                    switch (value) {
                      case "imagePath":
                        return (
                          <td
                            onClick={() => {
                              openEditScreen(blueprintData);
                            }}
                            key={value}
                          >
                            {blueprintData[value] === "" ||
                            blueprintData[value] === undefined ? (
                              "not found"
                            ) : (
                              <Image
                                src={"file:///" + blueprintData[value]}
                                height={100}
                                width="auto"
                              ></Image>
                            )}
                          </td>
                        );
                      default:
                        return (
                          <td
                            onClick={() => {
                              openEditScreen(blueprintData);
                            }}
                            key={value}
                          >
                            {blueprintData[value]}
                          </td>
                        );
                    }
                  })}
                  {exData.map((value) => {
                    return (
                      <td
                        onClick={() => {
                          openEditScreen(blueprintData);
                        }}
                        key={value}
                      >
                        {blueprintData.subDatas === undefined
                          ? ""
                          : blueprintData.subDatas.find(
                              (subData) => subData["attribute"] === value
                            )?.value}
                      </td>
                    );
                  })}
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => deleteData(blueprintData.id)}
                    >
                      <FaTrashAlt />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <EditModal show={modalShow} onHide={() => setModalShow(false)} />
    </Container>
  );
};
