import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<RecoilRoot>
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			</RecoilRoot>
		</>
	);
};

export default Providers;
