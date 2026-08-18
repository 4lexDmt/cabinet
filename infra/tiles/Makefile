.PHONY: all fetch record verify build tiles clean help

help:
	@echo "Cabinet tile pipeline — an OFFLINE build step."
	@echo "It never runs at request time and is never imported by the app."
	@echo
	@echo "  make fetch    download sources, verify sha256 against checksums.json"
	@echo "  make record   download sources and WRITE checksums.json"
	@echo "  make verify   re-download and check nothing upstream changed silently"
	@echo "  make build    process sources into apps/web/public/geo/mapkit/"
	@echo "  make tiles    tippecanoe -> PMTiles v3 (needs tippecanoe on PATH)"
	@echo "  make all      fetch + build"
	@echo "  make clean    remove the download cache and tile build output"

all: fetch build

fetch:
	./fetch.sh

record:
	./fetch.sh --record

# Natural Earth and Overture both revise in place. This target exists so that a
# boundary which moved is loud rather than silent.
verify:
	rm -rf .cache
	./fetch.sh

build:
	python3 build.py

tiles:
	./tile.sh

clean:
	rm -rf .cache build
