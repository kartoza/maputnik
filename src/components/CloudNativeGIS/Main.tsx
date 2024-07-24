import { useEffect, useState } from 'react'
import Modal from '../Modal'
import CloudNativeGISStyle from "./Style.tsx";
import { ToolbarAction } from "../AppToolbar.tsx";
import { MdOutlineSave } from "react-icons/md";

export type StyleProps = {
  id: number,
  name: string,
  style_url: string
}
export type DataProps = {
  name: string,
  default_style: StyleProps
  styles: [StyleProps]
}

type ModalOpenProps = {
  ToolbarAction: unknown,
  mapStyle: object
  onStyleOpen(...args: unknown[]): unknown
};

function CloudNativeGISByLayer(props: ModalOpenProps) {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DataProps | undefined>(undefined);

  // Fetch data
  useEffect(() => {
    const url = new URL(document.URL);
    const api = '' + url.searchParams.get('api-url');

    fetch(api, {
      mode: 'cors',
      credentials: "same-origin"
    })
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        setData(data)
      })
      .catch((err) => {
        setError(`Failed to load: '${api}'`)
        console.error(err);
        console.warn('Could not open the style URL', api)
      })
  }, [])

  let errorElement;
  if (error) {
    errorElement = (
      <div className="maputnik-modal-error">
        {error}
      </div>
    );
  }

  return (
    <>
      {
        data ? <>
          <CloudNativeGISStyle
            data={data}
            mapStyle={props.mapStyle}
            onStyleOpen={props.onStyleOpen}
          />
        </> : <Modal
          data-wd-key="modal:open"
          className='style-loading'
          isOpen={true}
          onOpenToggle={_ => {
          }}
          title={errorElement ? 'Error on Loading Data' : 'Loading Data'}
        >
          {errorElement}
          {
            !errorElement ?
              <section className="maputnik-modal-section">
                <h1>Loading Style</h1>
              </section> : null
          }
        </Modal>
      }
    </>
  )
}

function CloudNativeGISByStyleInput(props: ModalOpenProps) {
  useEffect(() => {
    // When input style presented, use it
    // @ts-ignore
    if (inputStyle) {
      // @ts-ignore
      props.onStyleOpen(inputStyle)
    }
  }, [])

  const updateStyle = () => {
    const parentWindow = window.opener?.parent;
    if (parentWindow) {
      try {
        parentWindow.postMessage(props.mapStyle);
        window.close();
      } catch (err) {
        /* empty */
      }
    }
  }

  return <>
    <div style={{
      display: "flex",
      height: "100%",
      flexGrow: 1,
      alignItems: "center"
    }}>
      <div></div>
    </div>
    <ToolbarAction onClick={updateStyle}>
      <MdOutlineSave/>
      <span className="maputnik-icon-text">Save</span>
    </ToolbarAction>
  </>
}

export default function CloudNativeGIS(props: ModalOpenProps) {
  /**Cloud native GIS component*/
  let style = null
  try {
    // @ts-ignore
    style = inputStyle
  } catch (err) {
    /* empty */
  }

  // @ts-ignore
  if (style) {
    return <CloudNativeGISByStyleInput {...props}/>
  } else {
    return <CloudNativeGISByLayer {...props}/>
  }
}
