import React, { Suspense } from "react";
import Loading from '@/components/Loading'

/**
 * @description 路由懒加载
 * @param {Element} Comp 需要访问的组件
 * @returns element
 */
const lazyLoad = (Comp: React.LazyExoticComponent<any>): React.ReactNode => {
	return (
		<Suspense
			fallback={<Loading />}
		>
			<Comp />
		</Suspense>
	);
};

export default lazyLoad;
