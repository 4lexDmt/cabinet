.PHONY: all fetch record verify build tiles clean help world fetch-world build-world

help:
	@echo "Cabinet tile pipeline — an OFFLINE build step."
	@echo "It never runs at request time and is never imported by the app."
	@echo
	@echo "  make fetch        download Natural Earth sources, verify sha256"
	@echo "  make fetch-world  download Stage 1 (EE / Black Sea) sources"
	@echo "  make record       download Natural Earth and WRITE checksums.json"
	@echo "  make verify       re-download and check nothing upstream changed silently"
	@echo "  make build        process sources into apps/web/public/geo/mapkit/"
	@echo "  make build-world  build the Stage 1 province / city / corridor layers"
	@echo "  make world        fetch-world + build-world"
	@echo "  make tiles        tippecanoe -> PMTiles v3 (needs tippecanoe on PATH)"
	@echo "  make all          fetch + fetch-world + build"
	@echo "  make clean        remove the download cache and tile build output"

all: fetch build

fetch:
	./fetch.sh
	python3 fetch_world.py

record:
	./fetch.sh --record

# Natural Earth and Overture both revise in place. This target exists so that a
# boundary which moved is loud rather than silent.
verify:
	rm -rf .cache
	./fetch.sh

fetch-world:
	python3 fetch_world.py

build-world:
	python3 build_world.py

world: fetch-world build-world

build:
	python3 build.py
	python3 build_world.py

tiles:
	./tile.sh

clean:
	rm -rf .cache build
