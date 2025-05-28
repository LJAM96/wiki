import { workspaceAtom } from "@/features/user/atoms/current-user-atom.ts";
import { useAtom } from "jotai";
import * as z from "zod";
import { useState } from "react";
import { updateWorkspace, uploadLogo } from "@/features/workspace/services/workspace-service.ts";
import { IWorkspace } from "@/features/workspace/types/workspace.types.ts";
import { 
  TextInput, 
  Button, 
  Group, 
  Avatar, 
  FileInput, 
  Text, 
  Stack,
  Divider 
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import useUserRole from "@/hooks/use-user-role.tsx";
import { useTranslation } from "react-i18next";
import { IconUpload } from "@tabler/icons-react";

const formSchema = z.object({
  name: z.string().min(1),
  brandName: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function WorkspaceNameForm() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [workspace, setWorkspace] = useAtom(workspaceAtom);
  const { isAdmin } = useUserRole();

  const form = useForm<FormValues>({
    validate: zodResolver(formSchema),
    initialValues: {
      name: workspace?.name || "",
      brandName: workspace?.brandName || "",
    },
  });

  async function handleSubmit(data: FormValues) {
    setIsLoading(true);

    try {
      let logoUrl = workspace?.logo || null;
      let faviconUrl = workspace?.favicon || null;
      let iconUrl = workspace?.icon || null;

      // Upload logo if changed
      if (logoFile) {
        const logoResponse = await uploadLogo(logoFile);
        logoUrl = logoResponse.url;
      }

      // Upload favicon if changed
      if (faviconFile) {
        const faviconResponse = await uploadLogo(faviconFile);
        faviconUrl = faviconResponse.url;
      }

      // Upload icon if changed
      if (iconFile) {
        const iconResponse = await uploadLogo(iconFile);
        iconUrl = iconResponse.url;
      }

      const updatedWorkspace = await updateWorkspace({ 
        name: data.name,
        brandName: data.brandName,
        logo: logoUrl,
        favicon: faviconUrl,
        icon: iconUrl
      });

      setWorkspace(updatedWorkspace);
      setLogoFile(null);
      setFaviconFile(null);
      setIconFile(null);
      notifications.show({ message: t("Updated successfully") });
    } catch (err) {
      console.log(err);
      notifications.show({
        message: t("Failed to update data"),
        color: "red",
      });
    }
    setIsLoading(false);
    form.resetDirty();
  }

  const isDirty = form.isDirty() || logoFile || faviconFile || iconFile;

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          id="name"
          label={t("Workspace Name")}
          placeholder={t("e.g ACME")}
          variant="filled"
          readOnly={!isAdmin}
          {...form.getInputProps("name")}
        />

        <TextInput
          id="brandName"
          label={t("Brand Name")}
          placeholder={t("e.g ACME (replaces 'Docmost' throughout the UI)")}
          variant="filled"
          readOnly={!isAdmin}
          {...form.getInputProps("brandName")}
        />

        <Divider label={t("Branding Assets")} labelPosition="left" />

        {/* Logo Upload */}
        <Group gap="md" align="flex-start">
          <div>
            <Text size="sm" fw={500} mb={4}>
              {t("Logo")}
            </Text>
            <Avatar 
              src={logoFile ? URL.createObjectURL(logoFile) : (workspace?.logo || null)} 
              size={64}
              variant="filled"
            />
          </div>
          {isAdmin && (
            <FileInput
              label=""
              placeholder={t("Upload logo")}
              accept="image/*"
              value={logoFile}
              onChange={setLogoFile}
              leftSection={<IconUpload size={16} />}
              variant="filled"
              style={{ flex: 1 }}
            />
          )}
        </Group>

        {/* Favicon Upload */}
        <Group gap="md" align="flex-start">
          <div>
            <Text size="sm" fw={500} mb={4}>
              {t("Favicon")}
            </Text>
            <Avatar 
              src={faviconFile ? URL.createObjectURL(faviconFile) : (workspace?.favicon || null)} 
              size={32}
              variant="filled"
            />
          </div>
          {isAdmin && (
            <FileInput
              label=""
              placeholder={t("Upload favicon")}
              accept="image/*"
              value={faviconFile}
              onChange={setFaviconFile}
              leftSection={<IconUpload size={16} />}
              variant="filled"
              style={{ flex: 1 }}
            />
          )}
        </Group>

        {/* Icon Upload */}
        <Group gap="md" align="flex-start">
          <div>
            <Text size="sm" fw={500} mb={4}>
              {t("Icon")}
            </Text>
            <Avatar 
              src={iconFile ? URL.createObjectURL(iconFile) : (workspace?.icon || null)} 
              size={48}
              variant="filled"
            />
          </div>
          {isAdmin && (
            <FileInput
              label=""
              placeholder={t("Upload icon")}
              accept="image/*"
              value={iconFile}
              onChange={setIconFile}
              leftSection={<IconUpload size={16} />}
              variant="filled"
              style={{ flex: 1 }}
            />
          )}
        </Group>

        {isAdmin && (
          <Button
            type="submit"
            disabled={isLoading || !isDirty}
            loading={isLoading}
          >
            {t("Save Changes")}
          </Button>
        )}
      </Stack>
    </form>
  );
}
