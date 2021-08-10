deploy:
	npm version patch; \
	git commit -m "new patch"; \
	git push; \
	npm run build; \
	cd functions; \
	npm run build; \
	cd ..; \
	firebase deploy;