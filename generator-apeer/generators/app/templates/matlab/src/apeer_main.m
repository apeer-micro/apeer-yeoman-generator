function [] = apeer_main(varargin)

    adk = ApeerDevKit(varargin{:});
    inputs = adk.get_inputs();

    outputs = your_code(<%- module_inputs_matlab_adk %>);

    <%- module_outputs_matlab_adk %>

    adk.finalize();

end

