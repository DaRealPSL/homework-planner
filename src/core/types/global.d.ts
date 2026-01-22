//src/core/types/global.d.ts

/// <reference types="vite/client" />

// Third-party module without types
declare module 'react-lazy-load-image-component';

// Gneeric asset imports (images, fonts, styles)
declare module '*.svg' {
	import * as React from 'react';
	const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
	export default ReactComponent;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';
declare module '*.ico';
declare module '*.bmp';

declare module '*.module.css' {
	const classes: { [key: string]: string };
	export default classes;
}
declare module '*.module.scss' {
	const classes: { [key: string]: string };
	export default classes;
}

// Provide small catch-all so importing unknown files won't break the entire build..
declare module '*?raw' {
	const content: string;
	export default content;
}