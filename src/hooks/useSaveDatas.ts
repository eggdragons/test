import { useCallback, useReducer, useState } from "react";
import { BlueprintData } from "../schema/blueprintData";
import type { IpcStatus } from "../schema/ipc";
import { AlertProps, alertReducer, initialState } from "./alertReducer";

type Status = IpcStatus;

export type ReturnUseOperateIpc = {
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
  alert: AlertProps;
  saveDataFunc: () => void;
};

export const useSaveDatas = (
  projectId: number,
  NumberDataPerPage: number,
  page: number,
  currentDatas: BlueprintData[]
): ReturnUseOperateIpc => {
  const [status, setStatus] = useState<Status>("stop");
  const [alert, dispatch] = useReducer(alertReducer, initialState);
  const ipc = "store";
  const method = "set";

  const saveDataFunc = useCallback(() => {
    const fetch = async () => {
      setStatus("progress");
      dispatch({
        type: ipc,
        payload: { method: method, status: "progress" },
      });

      try {
        const data: BlueprintData[] = await window.storeApi.getStoreValue(
          String(projectId),
          "blueprint"
        );

        //TODO value.idではなくindexが適切？
        const prevDatas: BlueprintData[] = data.filter((value) => {
          return (page - 1) * NumberDataPerPage > value.id;
        });

        const nextDatas: BlueprintData[] = data.filter((value) => {
          return page * NumberDataPerPage <= value.id;
        });

        const totalDatas: BlueprintData[] = [
          ...prevDatas,
          ...currentDatas,
          ...nextDatas,
        ];

        await window.storeApi.setStoreValue(
          String(projectId),
          "blueprint",
          totalDatas
        );

        setStatus("success");
        dispatch({
          type: ipc,
          payload: { method: method, status: "success" },
        });
      } catch (error) {
        setStatus("error");
        dispatch({
          type: ipc,
          payload: {
            method: method,
            status: "error",
            message: error as string,
          },
        });
      }
    };
    fetch();
  }, [NumberDataPerPage, currentDatas, page, projectId]);
  return { status, setStatus, alert, saveDataFunc };
};
