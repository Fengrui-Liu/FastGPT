import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import RenderPluginInput from './renderPluginInput';
import { Button, Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useContextSelector } from 'use-context-selector';
import { PluginRunContext } from '../context';
import { WorkflowIOValueTypeEnum } from '@fastgpt/global/core/workflow/constants';

const RenderInput = () => {
  const { pluginInputs, variablesForm, histories, onStartChat, onNewChat, onSubmit, isChatting } =
    useContextSelector(PluginRunContext, (v) => v);

  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = variablesForm;

  useEffect(() => {
    reset(
      pluginInputs.reduce(
        (acc, input) => {
          acc[input.key] = input.defaultValue;
          return acc;
        },
        {} as Record<string, any>
      )
    );
  }, [pluginInputs, histories]);
  const isDisabledInput = histories.length > 0;

  return (
    <>
      {pluginInputs.map((input) => {
        return (
          <Controller
            key={input.key}
            control={control}
            name={input.key}
            rules={{
              validate: (value) => {
                if (input.valueType === WorkflowIOValueTypeEnum.boolean) {
                  return value !== undefined;
                }
                return !!value;
              }
            }}
            render={({ field: { onChange, value } }) => {
              return (
                <RenderPluginInput
                  value={value}
                  onChange={onChange}
                  label={input.label}
                  description={input.description}
                  isDisabled={isDisabledInput}
                  valueType={input.valueType}
                  placeholder={input.placeholder}
                  required={input.required}
                  min={input.min}
                  max={input.max}
                  isInvalid={errors && Object.keys(errors).includes(input.key)}
                />
              );
            }}
          />
        );
      })}
      {onStartChat && onNewChat && (
        <Flex justifyContent={'end'} mt={8}>
          <Button
            isLoading={isChatting}
            onClick={() => {
              if (histories.length > 0) {
                return onNewChat();
              }
              handleSubmit(onSubmit)();
            }}
          >
            {histories.length > 0 ? t('common:common.Restart') : t('common:common.Run')}
          </Button>
        </Flex>
      )}
    </>
  );
};

export default RenderInput;
