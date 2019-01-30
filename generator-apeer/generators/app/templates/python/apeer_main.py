from apeer_dev_kit import adk
import your_code

if __name__ == '__main__':
    inputs = adk.get_inputs()

    outputs = your_code.run(<%- module_inputs_adk %>)

    <%- module_outputs_adk %>

    adk.finalize()
