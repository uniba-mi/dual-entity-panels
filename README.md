# A Testbed for Dual-Entity Knowledge Panels

<p align="center">
    <img src="https://img.shields.io/badge/license-GPLv3-green.svg" alt="license">
    <br>
</p>

<p align="center">
    <a href="#summary">Summary</a>
    •
    <a href="#usage">Usage</a>
    •
    <a href="#contributing">Contributing</a>
    •
    <a href="#license">License</a>
</p>

## Summary

The current presentation of knowledge panels in web search engines is limited to displaying summarized information only when a query refers to a single entity. This repository contains a testbed for developing and evaluating dual-entity knowledge panels. The idea is to populate these novel knowledge panels with an explanation of the relationship between the entities of queries mentioning two of them. Previous research has demonstrated the ability to identify paths in Wikidata that connect any two entities, offering a valuable foundation for explaining their relationship. However, little research has been done on how to effectively present these paths in a user-friendly manner within this context. Therefore, this repository features a few pre-implemented presentation forms, such as graph-based visualizations and text-based approaches utilizing language models, to encourage further investigation in this area.

## Usage

Only the `docker` and `docker compose` scripts are required to run the programs within this repository. All dependencies are automatically installed using the corresponding Dockerfiles. This ensures reproducibility and ease of use. For guidance on how to install Docker click [here](https://docs.docker.com/get-docker/). To run the testbed proceed as follows:

1. `docker compose build`
2. `docker compose run --service-ports panels`

Inside the new container run:

3. `npm install`
4. `npm run dev`

## Contributing

To implement additional presentation forms for the dual-entity knowledge panels, proceed as follows:

1. Add another `svelte` file in the [formats](./src/lib/formats) folder with an appropriate name for your presentation form. This file will contain almost all your code. To start off, feel free to copy one the code from one of the other components within this folder.
2. In the [stores.js](./src/stores.js) file add a string representing the label referring to your presentation form in the `formats` array.
3. In the lower part of the [Panel.svelte](./src/lib/Panel.svelte) file, there is an if statement that maps the labels of the presentation forms to their corresponding `svelte` component. Following the shown pattern, add another else if to map the label you added in the `formats` array to the component you created in the first step. Don't forget to import your component in the top of the [Panel.svelte](./src/lib/Panel.svelte) file.
4. Reload/start the application if necessary. You should now be able to select your presentation form via the same dropdown menu as the other presentation forms.

## License

See [LICENSE](./LICENSE)
