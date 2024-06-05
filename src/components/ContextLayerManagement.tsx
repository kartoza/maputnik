import React from 'react'
import Modal from './Modal'
import style from "../libs/style.ts";

type ModalOpenProps = {
  onStyleOpen(...args: unknown[]): unknown
};

type ModalOpenState = {
  isOpen: boolean,
  error?: string | null
};

export default class ContextLayerManagement extends React.Component<ModalOpenProps, ModalOpenState> {
  constructor(props: ModalOpenProps) {
    super(props);
    this.state = {
      isOpen: true
    }
    const url = new URL(document.URL);
    const styleUrl = '' + url.searchParams.get('styleUrl');

    fetch(styleUrl, {
      mode: 'cors',
      credentials: "same-origin"
    })
      .then(function (response) {
        return response.json();
      })
      .then((body) => {
        // ----------------------------------------------------
        // Add basemap
        if (!body.sources) {
          body.sources = {}
        }
        body.sources.openstreetmap = {
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          type: 'raster'
        }
        body.layers = [
          {
            "id": "openstreetmap",
            "type": "raster",
            "source": "openstreetmap"
          }, ...body.layers
        ]
        // ----------------------------------------------------

        const mapStyle = style.ensureStyleValidity(body)
        console.log('Loaded style ', mapStyle.id)
        this.props.onStyleOpen(mapStyle)
        this.setState({
          isOpen: false
        });
      })
      .catch((err) => {
        this.setState({
          error: `Failed to load: '${styleUrl}'`
        });
        console.error(err);
        console.warn('Could not open the style URL', styleUrl)
      })
  }

  render() {
    let errorElement;
    if (this.state.error) {
      errorElement = (
        <div className="maputnik-modal-error">
          {this.state.error}
        </div>
      );
    }

    return (
      <div>
        <Modal
          data-wd-key="modal:open"
          className='style-loading'
          isOpen={this.state.isOpen}
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
      </div>
    )
  }
}

