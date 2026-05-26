import React, { useCallback, useState } from 'react';
import { Dimensions, FlatList, Modal, Platform, Pressable, Switch, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useTheme } from '@shopify/restyle';
import { Calendar, Check, ChevronDown, ChevronUp, Search, X } from 'lucide-react-native';

import { Box, Text } from '@/themes';
import type { Theme } from '@/themes';
import { Divider } from '@/shared/components/Divider';
import type { FilterFieldConfig, FilterValues, SelectOption } from '@/shared/types/filter.types';

const SCREEN_HEIGHT = Dimensions.get('window').height;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface FilterBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  fields: FilterFieldConfig[];
  values: FilterValues;
  /** Options for select-type fields. Key = FilterFieldConfig.key */
  optionsMap?: Record<string, SelectOption[]>;
  onChange: (values: FilterValues) => void;
  onClear: () => void;
}

// ---------------------------------------------------------------------------
// SelectInput — modal picker para campos type='select'
// ---------------------------------------------------------------------------
interface SelectInputProps {
  value: string | undefined;
  options: SelectOption[];
  placeholder?: string;
  onSelect: (value: string) => void;
  theme: ReturnType<typeof useTheme<Theme>>;
}

function SelectInput({ value, options, placeholder, onSelect, theme }: SelectInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const selectedLabel = options.find(o => o.value === value)?.label;

  const filteredOptions = search.trim()
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  function handleClose() {
    setOpen(false);
    setSearch('');
  }

  return (
    <>
      <Pressable onPress={() => setOpen(true)}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          borderWidth={1}
          borderColor={value ? 'primary' : 'border'}
          borderRadius="m"
          backgroundColor="surface"
          paddingHorizontal="m"
          style={{ height: 44 }}
        >
          <Text style={{ fontSize: 14, flex: 1 }} color={selectedLabel ? 'text' : 'textSecondary'}>
            {selectedLabel ?? placeholder ?? 'Seleccionar…'}
          </Text>
          <ChevronDown size={16} color={theme.colors.textSecondary} />
        </Box>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={handleClose}>
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}
          onPress={handleClose}
        >
          <Pressable onPress={e => e.stopPropagation()}>
            <Box
              backgroundColor="cardBackground"
              style={{ maxHeight: SCREEN_HEIGHT * 0.6, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
            >
              {/* Handle */}
              <Box alignItems="center" paddingTop="s" paddingBottom="xs">
                <Box style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.colors.border }} />
              </Box>

              {/* Search input */}
              <Box
                flexDirection="row"
                alignItems="center"
                borderWidth={1}
                borderColor="border"
                borderRadius="m"
                backgroundColor="surface"
                marginHorizontal="m"
                marginBottom="s"
                paddingHorizontal="s"
                style={{ height: 40, gap: 8 }}
              >
                <Search size={15} color={theme.colors.textSecondary} />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Buscar…"
                  placeholderTextColor={theme.colors.textSecondary}
                  autoFocus
                  style={{ flex: 1, fontSize: 14, color: theme.colors.text }}
                />
              </Box>

              {/* Limpiar selección */}
              {value !== undefined && !search && (
                <Pressable onPress={() => { onSelect(''); handleClose(); }}>
                  <Box paddingHorizontal="m" paddingVertical="s" borderBottomWidth={1} borderColor="border">
                    <Text color="primary" style={{ fontSize: 14, fontWeight: '500' }}>
                      Limpiar selección
                    </Text>
                  </Box>
                </Pressable>
              )}

              <FlatList
                data={filteredOptions}
                keyExtractor={item => item.value}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  <Box paddingHorizontal="m" paddingVertical="l" alignItems="center">
                    <Text color="textSecondary" style={{ fontSize: 14 }}>
                      Sin resultados para "{search}"
                    </Text>
                  </Box>
                }
                renderItem={({ item }) => {
                  const isSelected = item.value === value;
                  return (
                    <Pressable onPress={() => { onSelect(item.value); handleClose(); }}>
                      <Box
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                        paddingHorizontal="m"
                        paddingVertical="s"
                      >
                        <Text
                          style={{ fontSize: 14, fontWeight: isSelected ? '600' : '400' }}
                          color={isSelected ? 'primary' : 'text'}
                        >
                          {item.label}
                        </Text>
                        {isSelected && <Check size={16} color={theme.colors.primary} strokeWidth={2.5} />}
                      </Box>
                    </Pressable>
                  );
                }}
                contentContainerStyle={{ paddingBottom: 32 }}
              />
            </Box>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

// ---------------------------------------------------------------------------
// DatePickerInput — native date picker para campos type='date'
// ---------------------------------------------------------------------------
interface DatePickerInputProps {
  value: string | undefined;
  placeholder?: string;
  onChange: (value: string) => void;
  theme: ReturnType<typeof useTheme<Theme>>;
}

function parseISODate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function DatePickerInput({ value, placeholder, onChange, theme }: DatePickerInputProps) {
  const [show, setShow] = useState(false);
  const [iosDraft, setIosDraft] = useState<Date | null>(null);

  const currentDate = value ? parseISODate(value) : new Date();

  function handleAndroidChange(_event: any, selected?: Date) {
    setShow(false);
    if (selected) {
      onChange(formatISODate(selected));
    }
  }

  function handleIOSChange(_event: any, selected?: Date) {
    if (selected) {
      setIosDraft(selected);
    }
  }

  function confirmIOS() {
    if (iosDraft) {
      onChange(formatISODate(iosDraft));
    }
    setShow(false);
    setIosDraft(null);
  }

  function cancelIOS() {
    setShow(false);
    setIosDraft(null);
  }

  return (
    <>
      <Pressable onPress={() => setShow(true)}>
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          borderWidth={1}
          borderColor={value ? 'primary' : 'border'}
          borderRadius="m"
          backgroundColor="surface"
          paddingHorizontal="m"
          style={{ height: 44, gap: 8 }}
        >
          <Calendar size={16} color={value ? theme.colors.primary : theme.colors.textSecondary} />
          <Text
            style={{ fontSize: 14, flex: 1 }}
            color={value ? 'text' : 'textSecondary'}
          >
            {value ?? placeholder ?? 'Seleccionar fecha…'}
          </Text>
          {value ? (
            <Pressable
              onPress={e => { e.stopPropagation(); onChange(''); }}
              hitSlop={8}
            >
              <X size={15} color={theme.colors.textSecondary} />
            </Pressable>
          ) : null}
        </Box>
      </Pressable>

      {Platform.OS === 'android' && show && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display="default"
          onChange={handleAndroidChange}
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal
          visible={show}
          transparent
          animationType="fade"
          onRequestClose={cancelIOS}
        >
          <Pressable
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}
            onPress={cancelIOS}
          >
            <Pressable onPress={e => e.stopPropagation()}>
              <Box
                backgroundColor="cardBackground"
                style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
              >
                {/* Handle */}
                <Box alignItems="center" paddingTop="s" paddingBottom="xs">
                  <Box style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.colors.border }} />
                </Box>

                {/* Botones */}
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  paddingHorizontal="m"
                  paddingVertical="s"
                >
                  <Pressable onPress={cancelIOS}>
                    <Text color="textSecondary" style={{ fontSize: 16 }}>Cancelar</Text>
                  </Pressable>
                  <Pressable onPress={confirmIOS}>
                    <Text color="primary" style={{ fontSize: 16, fontWeight: '600' }}>Listo</Text>
                  </Pressable>
                </Box>

                <DateTimePicker
                  value={iosDraft ?? currentDate}
                  mode="date"
                  display="spinner"
                  onChange={handleIOSChange}
                  style={{ height: 216 }}
                />
                <Box style={{ height: 32 }} />
              </Box>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Backdrop
// ---------------------------------------------------------------------------
function renderBackdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.5}
    />
  );
}

// ---------------------------------------------------------------------------
// FilterBottomSheet
// ---------------------------------------------------------------------------
export function FilterBottomSheet({
  bottomSheetRef,
  fields,
  values,
  optionsMap = {},
  onChange,
  onClear,
}: FilterBottomSheetProps) {
  const theme = useTheme<Theme>();

  const [localValues, setLocalValues] = useState<FilterValues>(values);
  const [enabledKeys, setEnabledKeys] = useState<Set<string>>(new Set());
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const toggleableFields = fields.filter(f => f.toggleable);
  const visibleFields = fields.filter(f => f.enabled || enabledKeys.has(f.key));

  function handleToggleChip(key: string) {
    setEnabledKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function handleFieldChange(key: string, text: string) {
    setLocalValues(prev => ({ ...prev, [key]: text || undefined }));
  }

  const handleClear = useCallback(() => {
    setLocalValues({});
    setEnabledKeys(new Set());
    onClear();
  }, [onClear]);

  function handleApply() {
    onChange(localValues);
    bottomSheetRef.current?.dismiss();
  }

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enableDynamicSizing
      maxDynamicContentSize={SCREEN_HEIGHT * 0.85}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: theme.colors.cardBackground }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.border }}
    >
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.m,
          paddingBottom: theme.spacing.xl,
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ---------------------------------------------------------------- */}
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="m"
          marginTop="xs"
        >
          <Text variant="subheader">Filtros</Text>
          <Pressable onPress={handleClear}>
            <Text color="primary" style={{ fontSize: 14, fontWeight: '500' }}>
              Limpiar
            </Text>
          </Pressable>
        </Box>

        {/* ---------------------------------------------------------------- */}
        {/* Accordion — optional fields                                       */}
        {/* ---------------------------------------------------------------- */}
        {toggleableFields.length > 0 && (
          <>
            <Pressable onPress={() => setIsAccordionOpen(prev => !prev)}>
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                paddingVertical="s"
                marginBottom="xs"
              >
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <Text color="textSecondary" style={{ fontSize: 13, fontWeight: '500' }}>
                    Filtros adicionales
                  </Text>
                  {enabledKeys.size > 0 && (
                    <Box
                      backgroundColor="primary"
                      borderRadius="full"
                      style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Text color="textInverse" style={{ fontSize: 11, fontWeight: '700' }}>
                        {enabledKeys.size}
                      </Text>
                    </Box>
                  )}
                </Box>
                {isAccordionOpen
                  ? <ChevronUp size={16} color={theme.colors.textSecondary} />
                  : <ChevronDown size={16} color={theme.colors.textSecondary} />
                }
              </Box>
            </Pressable>

            {isAccordionOpen && (
              <Box marginBottom="m" gap="xs">
                {toggleableFields.map(field => {
                  const isActive = enabledKeys.has(field.key);
                  return (
                    <Pressable key={field.key} onPress={() => handleToggleChip(field.key)}>
                      <Box flexDirection="row" alignItems="center" gap="s" paddingVertical="xs">
                        {/* Checkbox */}
                        <Box
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 4,
                            borderWidth: 2,
                            borderColor: isActive ? theme.colors.primary : theme.colors.border,
                            backgroundColor: isActive ? theme.colors.primary : 'transparent',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isActive && <Check size={13} color="#ffffff" strokeWidth={3} />}
                        </Box>
                        <Text
                          color={isActive ? 'text' : 'textSecondary'}
                          style={{ fontSize: 14, fontWeight: isActive ? '500' : '400' }}
                        >
                          {field.label}
                        </Text>
                      </Box>
                    </Pressable>
                  );
                })}
              </Box>
            )}

            <Divider marginVertical="xs" />
          </>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Filter fields                                                     */}
        {/* ---------------------------------------------------------------- */}
        <Box gap="m" marginTop="s">
          {visibleFields.map(field => (
            <Box key={field.key}>
              <Text variant="caption" color="textSecondary" style={{ marginBottom: 4 }}>
                {field.label}
              </Text>

              {field.type === 'select' ? (
                <SelectInput
                  value={localValues[field.key]}
                  options={optionsMap[field.key] ?? []}
                  placeholder={`Seleccionar ${field.label.toLowerCase()}…`}
                  onSelect={val => handleFieldChange(field.key, val)}
                  theme={theme}
                />
              ) : field.type === 'boolean' ? (
                // Boolean field — renders a native Switch.
                // Value is stored as 'true'/'false' string (FilterValues contract).
                <Box
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  borderWidth={1}
                  borderColor="border"
                  borderRadius="m"
                  backgroundColor="surface"
                  paddingHorizontal="m"
                  style={{ height: 44 }}
                >
                  <Text style={{ fontSize: 14 }} color={localValues[field.key] === 'true' ? 'text' : 'textSecondary'}>
                    {localValues[field.key] === 'true' ? 'Sí' : 'No'}
                  </Text>
                  <Switch
                    value={localValues[field.key] === 'true'}
                    onValueChange={val => handleFieldChange(field.key, val ? 'true' : 'false')}
                    trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                    thumbColor="#ffffff"
                  />
                </Box>
              ) : field.type === 'date' ? (
                <DatePickerInput
                  value={localValues[field.key]}
                  placeholder={field.placeholder ?? 'Seleccionar fecha…'}
                  onChange={val => handleFieldChange(field.key, val)}
                  theme={theme}
                />
              ) : (
                <Box
                  borderWidth={1}
                  borderColor="border"
                  borderRadius="m"
                  backgroundColor="surface"
                  paddingHorizontal="m"
                  style={{ height: 44 }}
                >
                  <TextInput
                    value={localValues[field.key] ?? ''}
                    onChangeText={text => handleFieldChange(field.key, text)}
                    placeholder={field.placeholder}
                    placeholderTextColor={theme.colors.textSecondary}
                    style={{
                      flex: 1,
                      height: '100%',
                      color: theme.colors.text,
                      fontSize: 14,
                    }}
                    keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                  />
                </Box>
              )}
            </Box>
          ))}
        </Box>

        {/* ---------------------------------------------------------------- */}
        {/* Footer — Aplicar button                                           */}
        {/* ---------------------------------------------------------------- */}
        <Box marginTop="l">
          <Pressable onPress={handleApply} style={{ alignSelf: 'stretch' }}>
            <Box
              backgroundColor="primary"
              borderRadius="m"
              alignItems="center"
              justifyContent="center"
              style={{ height: 44 }}
            >
              <Text color="textInverse" style={{ fontSize: 15, fontWeight: '600' }}>
                Aplicar
              </Text>
            </Box>
          </Pressable>
        </Box>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
