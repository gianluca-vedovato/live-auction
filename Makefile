deploy:
	npm version patch; \
	git add .; \
	git commit -m "new patch" --no-verify; \
	git push; \
	npm run build; \
	cd functions; \
	npm run build; \
	cd ..; \
	firebase deploy;