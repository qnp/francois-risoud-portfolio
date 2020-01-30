MIN := .babelrc .editorconfig .eslintignore .eslintrc.js .gitignore .postcssrc.js Makefile README.md build loaders config index.html package-lock.json package.json server.js src static
SAVE_DIR := /Users/francoisrisoud/Dropbox/SAVE_DEV/02_FR/`date +'%y.%m.%d_%Hh%M'`

save:
	@mkdir $(SAVE_DIR);
	@cp -r $(MIN) $(SAVE_DIR);
	@echo successful saved in: $(SAVE_DIR);
