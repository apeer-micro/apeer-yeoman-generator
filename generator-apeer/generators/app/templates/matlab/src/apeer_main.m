function [] = apeer_main(varargin)
    
    adk = ApeerDevKit(varargin{:});
    
    your_code();
    
    adk.finalize();
    
end

