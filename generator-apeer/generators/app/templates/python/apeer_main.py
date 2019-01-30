from apeer_dev_kit import adk
import your_code

if __name__ == '__main__':
    inputs = adk.get_inputs()

    outputs = your_code.run(<%- module_inputs_python_adk %>)

    <%- module_outputs_python_adk %>

    adk.finalize()
