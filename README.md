## frozen-docs

Write docs in gitHub flavored markdown.

## Usage

1. Install dependencies: `$ npm install`;

2. Setting project config `config.json`:
	```
	{
		// markdown docs directory
		"source": "./content",

		// html docs directory
		"destination": "./pages",

		// github account
		"github": {
			"username": "",
	    	"password": ""
		}
	}
	```
	
3. Build docs: `$ ./frozen build`;

4. Run server: `$ ./frozen server`;


### Cli options

set server port:  
`$ ./frozen server --port 8080`

## License

Frozen-docs uses the MIT License, see our LICENSE file.
