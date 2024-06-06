import { useEffect, useState } from 'react'
import Modal from '../Modal'
import CloudNativeGISStyle from "./Style.tsx";

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

export default function CloudNativeGIS(props: ModalOpenProps) {
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

