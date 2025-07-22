import React, { useEffect, useRef } from 'react';
import Blockly from 'blockly';
import { v4 as uuidv4 } from 'uuid';
import { RobotCommand } from '../types/robot';

interface BlocklyEditorProps {
  onCodeChange: (commands: RobotCommand[]) => void;
}

const BlocklyEditor: React.FC<BlocklyEditorProps> = ({ onCodeChange }) => {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspace = useRef<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    if (!blocklyDiv.current) return;

    // Define custom blocks for robot control
    Blockly.Blocks['robot_move_forward'] = {
      init: function() {
        this.appendDummyInput()
          .appendField("move forward");
        this.appendValueInput("DISTANCE")
          .setCheck("Number")
          .appendField("distance");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("Move robot forward by specified distance");
      }
    };

    Blockly.Blocks['robot_turn'] = {
      init: function() {
        this.appendDummyInput()
          .appendField("turn")
          .appendField(new Blockly.FieldDropdown([
            ["left", "LEFT"],
            ["right", "RIGHT"]
          ]), "DIRECTION");
        this.appendValueInput("ANGLE")
          .setCheck("Number")
          .appendField("angle");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("Turn robot left or right by specified angle");
      }
    };

    Blockly.Blocks['robot_stop'] = {
      init: function() {
        this.appendDummyInput()
          .appendField("stop robot");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("Stop all robot movement");
      }
    };

    Blockly.Blocks['sensor_ultrasonic'] = {
      init: function() {
        this.appendDummyInput()
          .appendField("ultrasonic distance");
        this.setOutput(true, "Number");
        this.setColour(230);
        this.setTooltip("Get distance reading from ultrasonic sensor");
      }
    };

    Blockly.Blocks['sensor_color'] = {
      init: function() {
        this.appendDummyInput()
          .appendField("color sensor");
        this.setOutput(true, "String");
        this.setColour(230);
        this.setTooltip("Get color reading from color sensor");
      }
    };

    // Define code generators
    Blockly.JavaScript['robot_move_forward'] = function(block: any) {
      const distance = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_ATOMIC) || '100';
      return `moveForward(${distance});\n`;
    };

    Blockly.JavaScript['robot_turn'] = function(block: any) {
      const direction = block.getFieldValue('DIRECTION');
      const angle = Blockly.JavaScript.valueToCode(block, 'ANGLE', Blockly.JavaScript.ORDER_ATOMIC) || '90';
      return `turn('${direction}', ${angle});\n`;
    };

    Blockly.JavaScript['robot_stop'] = function(_block: any) {
      return `stopRobot();\n`;
    };

    Blockly.JavaScript['sensor_ultrasonic'] = function(_block: any) {
      return ['getUltrasonicDistance()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
    };

    Blockly.JavaScript['sensor_color'] = function(_block: any) {
      return ['getColorSensor()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
    };

    // Create workspace
    workspace.current = Blockly.inject(blocklyDiv.current, {
      toolbox: `
        <xml>
          <category name="Movement" colour="160">
            <block type="robot_move_forward">
              <value name="DISTANCE">
                <shadow type="math_number">
                  <field name="NUM">100</field>
                </shadow>
              </value>
            </block>
            <block type="robot_turn">
              <value name="ANGLE">
                <shadow type="math_number">
                  <field name="NUM">90</field>
                </shadow>
              </value>
            </block>
            <block type="robot_stop"></block>
          </category>
          <category name="Sensors" colour="230">
            <block type="sensor_ultrasonic"></block>
            <block type="sensor_color"></block>
          </category>
          <category name="Logic" colour="210">
            <block type="controls_if"></block>
            <block type="logic_compare"></block>
            <block type="logic_operation"></block>
            <block type="logic_boolean"></block>
          </category>
          <category name="Loops" colour="120">
            <block type="controls_repeat_ext">
              <value name="TIMES">
                <shadow type="math_number">
                  <field name="NUM">10</field>
                </shadow>
              </value>
            </block>
            <block type="controls_whileUntil"></block>
            <block type="controls_for">
              <value name="FROM">
                <shadow type="math_number">
                  <field name="NUM">1</field>
                </shadow>
              </value>
              <value name="TO">
                <shadow type="math_number">
                  <field name="NUM">10</field>
                </shadow>
              </value>
              <value name="BY">
                <shadow type="math_number">
                  <field name="NUM">1</field>
                </shadow>
              </value>
            </block>
          </category>
          <category name="Math" colour="230">
            <block type="math_number"></block>
            <block type="math_arithmetic"></block>
            <block type="math_single"></block>
          </category>
        </xml>
      `,
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      }
    });

    // Listen for workspace changes
    const handleWorkspaceChange = () => {
      if (!workspace.current) return;
      
      try {
        const code = Blockly.JavaScript.workspaceToCode(workspace.current);
        const commands = parseCodeToCommands(code);
        onCodeChange(commands);
      } catch (error) {
        console.error('Error generating code:', error);
      }
    };

    workspace.current.addChangeListener(handleWorkspaceChange);

    return () => {
      if (workspace.current) {
        workspace.current.dispose();
      }
    };
  }, [onCodeChange]);

  const parseCodeToCommands = (code: string): RobotCommand[] => {
    const commands: RobotCommand[] = [];
    const lines = code.split('\n').filter(line => line.trim());

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('moveForward(')) {
        const match = trimmed.match(/moveForward\((\d+)\)/);
        if (match) {
          commands.push({
            type: 'move',
            payload: { direction: 'forward', distance: parseInt(match[1]) },
            id: uuidv4()
          });
        }
      } else if (trimmed.startsWith('turn(')) {
        const match = trimmed.match(/turn\('(\w+)', (\d+)\)/);
        if (match) {
          commands.push({
            type: 'rotate',
            payload: { direction: match[1].toLowerCase(), angle: parseInt(match[2]) },
            id: uuidv4()
          });
        }
      } else if (trimmed.startsWith('stopRobot()')) {
        commands.push({
          type: 'stop',
          id: uuidv4()
        });
      }
    });

    return commands;
  };

  return (
    <div className="w-full h-full">
      <div ref={blocklyDiv} className="w-full h-full" />
    </div>
  );
};

export default BlocklyEditor;