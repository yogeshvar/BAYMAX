download_empatheticdialogues_dataset:
### abort if dailydialog folder already exists
	@if [ -d BAYMAX/dataset/empatheticdialogues ]; \
		then echo "Folder for EmpatheticDialogues dataset already exists! Please delete the folder 'empatheticdialogues' if you want to re-download the dataset."; \
	else \
		if ! [ -d BAYMAX/dataset/empatheticdialogues ]; then \
			echo "Creating folder 'BAYMAX/dataset/empatheticdialogues'..." && \
			mkdir -p BAYMAX/dataset/empatheticdialogues && \
			echo "Folder 'BAYMAX/dataset/empatheticdialogues' successfully created." && \
			echo "Downloading empatheticdialogues dataset..." && \
			curl https://dl.fbaipublicfiles.com/parlai/empatheticdialogues/empatheticdialogues.tar.gz >> BAYMAX/dataset/empatheticdialogues/data.tar.gz && \
			echo "EmpatheticDialogues dataset successfully downloaded." && \
			echo "Unpacking empatheticdialogues dataset..." && \
			tar -xvf BAYMAX/dataset/empatheticdialogues/data.tar.gz -C BAYMAX/dataset/empatheticdialogues --strip-components 1 && \
			echo "EmpatheticDialogues dataset successfully unpacked." && \
			echo "Removing zip file..." && \
			rm BAYMAX/dataset/empatheticdialogues/data.tar.gz && \
			echo "EmpatheticDialogues dataset setup successful!"; \
		fi \
	fi