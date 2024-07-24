import { useEffect, useState } from "react";
import { ToolbarSelect } from "../AppToolbar.tsx";
import { DataProps } from "./Main.tsx";
import CloudNativeGISSave from "./Save.tsx";
import Modal from "../Modal.tsx";

type ModalOpenProps = {
  data: DataProps
  mapStyle: object
  onStyleOpen(...args: unknown[]): unknown
};

export default function CloudNativeGISStyle(props: ModalOpenProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();
  const [value, setValue] = useState<number>(props.data.default_style.id);

  const style = props.data.styles.find(style => style.id === value)

  // When props is changed
  useEffect(() => {
    setIsOpen(true)
    if (!style) {
      return
    }
    const styleUrl = style.style_url
    fetch(styleUrl, {
      mode: 'cors',
      credentials: "same-origin"
    })
      .then(function (response) {
        return response.json();
      })
      .then((style) => {
        props.onStyleOpen(style)
        setIsOpen(false)
      })
      .catch((err) => {
        setError(err)
        console.error(err);
        console.warn('Could not open the style URL', styleUrl)
      })
  }, [style])

  // Check error
  let errorElement;
  if (error) {
    errorElement = (
      <div className="maputnik-modal-error">
        {error}
        <a
          href="#" onClick={() => setError(null)}
          className="maputnik-modal-error-close">×</a>
      </div>
    );
  }

  return (
    <>
      <div style={{
        display: "flex",
        height: "100%",
        flexGrow: 1,
        alignItems: "center"
      }}>
        <div>
          <div style={{ fontSize: "0.5rem", opacity: 0.7 }}>Layer</div>
          <div style={{ fontSize: "0.8rem" }}>{props.data.name}</div>
        </div>
        <div>
          <ToolbarSelect wdKey="nav:inspect">
            <label>
              <select
                className="maputnik-select"
                data-wd-key="maputnik-select"
                onChange={(e) => setValue(parseInt(e.target.value))}
                value={value}
              >
                {props.data.styles.map((style) => {
                  return (
                    <option
                      key={style.id} value={style.id}
                      data-wd-key={style.id}>
                      {style.name}
                    </option>
                  );
                })}
              </select>
            </label>
          </ToolbarSelect>
        </div>
      </div>
      <CloudNativeGISSave
        mapStyle={props.mapStyle}
        style={style}
      />

      {/* MODAL FOR LOADING STYLE */}
      <Modal
        data-wd-key="modal:open"
        className='style-loading'
        isOpen={isOpen}
        onOpenToggle={_ => {
        }}
        title={errorElement ? 'Error on Loading Style' : 'Loading Style'}
      >
        {errorElement}
        {
          !errorElement ?
            <section className="maputnik-modal-section">
              <h1>Loading Style</h1>
            </section> : null
        }
      </Modal>
    </>
  )
}
