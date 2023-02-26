import React from "react";
import { useContext, useState } from "react";

import { DesignContext } from "./DesignContext";
import { linkTo } from "../../router/linkTo";

import Button from "react-bootstrap/Button";
import { LoadDesignData } from "./LoadDesignData";
import { useOperateIpc } from "../../hooks/useOperateIpc";
import { useComment } from "../../hooks/useComment";
import { GlobalAlert } from "../../components/GlobalAlert";
import { SampleModal } from "./SampleModal";

export type Sample = {
  folder: string;
  file: string;
}[];

export const DesignButton = () => {
  const { designDatas, projectId, sampleData } = useContext(DesignContext);
  const { ipcStatus, setIpcStatus, alert, operateIpc } = useOperateIpc();

  //サンプルのモーダル機能
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [imagePath, setImagePath] = useState<string>("");

  //サンプル機能
  const sampleFunc = async () => {
    const sampleFile = designDatas.map((designData) => {
      const targetFolder =
        designData.combi !== "" ? designData.combi : designData.folder;
      const targetId = designDatas.filter(
        (designData) => designData.folder === targetFolder
      )[0].id;
      if (sampleData[targetId] !== undefined && sampleData[targetId] !== "") {
        return sampleData[targetId];
      } else {
        return designDatas.filter((designData) => designData.id === targetId)[0]
          .fileDatas[0].name;
      }
    });
    const sample: Sample = designDatas.map((designData, index) => {
      return { folder: designData.folder, file: sampleFile[index] };
    });
    const fetch = await operateIpc({
      ipc: "store",
      method: "set",
      arg: {
        name: String(projectId),
        key: "sample",
        value: sample,
      },
    });
    if (fetch.status) {
      const fetch = await operateIpc({
        ipc: "operateFastApi",
        method: "makeSample",
        arg: {
          projectId: projectId,
        },
      });
      if (fetch.status) {
        const imagePath = fetch.response as string;
        setImagePath(imagePath);
        setModalShow(true);
        setIpcStatus("stop");
      }
    }
  };

  //データを保存する
  const saveData = async () => {
    await operateIpc({
      ipc: "store",
      method: "set",
      arg: { name: String(projectId), key: "designDatas", value: designDatas },
    });
    await operateIpc({
      ipc: "store",
      method: "set",
      arg: {
        name: String(projectId),
        key: "maxQuantity",
        value: calculationMaxQuantity(),
      },
    });
  };

  //組合せ総数の計算
  const calculationMaxQuantity = () => {
    const maxQuantity = designDatas
      .map((designData) => {
        return designData.combi === "" ? designData.fileDatas.length : 1;
      })
      .reduce((result, value) => {
        return result * value;
      }, 1);
    return maxQuantity;
  };

  //次へ
  const next = async (e: React.MouseEvent<HTMLButtonElement>) => {
    saveData();
    linkTo("prep");
  };

  const { setComment } = useComment();

  return (
    <>
      <LoadDesignData setComment={setComment} />
      {designDatas !== undefined && (
        <>
          <Button
            variant="success"
            type="button"
            onClick={sampleFunc}
            className={"me-3"}
            onMouseEnter={() =>
              setComment([
                "このボタンを押すと、ジェネラティブしたときのサンプルを表示させることが出来るよ。",
                "どの組み合わせ・どの順番でジェネラティブするかは、下の表で設定してね。",
              ])
            }
          >
            サンプル
          </Button>
          <Button
            variant="success"
            type="button"
            onClick={saveData}
            className={"me-3"}
            onMouseEnter={() =>
              setComment([
                "編集が終わったら、必ず保存ボタンを押してね。",
                "今は、あえて、自動保存には対応してないんだ。",
              ])
            }
          >
            データを保存
          </Button>
          <Button
            onClick={next}
            onMouseEnter={() =>
              setComment([
                "ジェネラティブの設定が終わったら、次へを押してね。",
                "次へを押すと、ここで設定したデータが保存されて、次のステップに進むよ。",
              ])
            }
          >
            次へ
          </Button>
          <GlobalAlert
            ipcStatus={ipcStatus}
            setIpcStatus={setIpcStatus}
            alert={alert}
          />
          <SampleModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            image={imagePath}
          />
        </>
      )}
    </>
  );
};
