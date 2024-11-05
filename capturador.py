import os
from datetime import datetime

class ProjectDocumenter:
    def __init__(self):
        # Directorios y archivos a ignorar
        self.ignore_dirs = {
            'node_modules',
            'dist',
            '.git',
            '.idea',
            '.vscode',
            'coverage',
            'build',
            '__pycache__',
            'postgres_data'
        }

        # Archivos específicos a ignorar
        self.ignore_files = {
            'package-lock.json',
            '.DS_Store',
            'thumbs.db'
        }

        # Extensiones de archivos a incluir
        self.include_extensions = {
            '.ts',
            '.js',
            '.json',
            '.yml',
            '.yaml',
            '.env',
            '.dockerignore',
            '.gitignore',
            '.graphql',
            '.md',
            ''  # Para archivos sin extensión como 'Dockerfile'
        }

        # Nombres específicos de archivos a incluir sin importar extensión
        self.specific_files = {
            'Dockerfile',
            'docker-compose.yml',
            '.env',
            '.gitignore',
            'README.md',
            'tsconfig.json',
            'package.json'
        }

    def should_include_file(self, filename, filepath):
        # Verificar si el archivo está en la lista de ignorados
        if filename in self.ignore_files:
            return False

        # Verificar si es un archivo específico que queremos incluir
        if filename in self.specific_files:
            return True

        # Obtener la extensión del archivo
        _, ext = os.path.splitext(filename)

        # Verificar si la extensión está en nuestra lista de inclusión
        return ext in self.include_extensions

    def create_documentation(self):
        # Obtener la fecha actual para el nombre del archivo
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        # Encontrar todos los microservicios y gateways (directorios que terminan en -ms o -gateway)
        microservices_and_gateways = [d for d in os.listdir('.') if os.path.isdir(d) and (d.endswith('-ms') or d.endswith('-gateway'))]

        # Documentar archivos en la raíz del proyecto
        root_doc_path = f'project_documentation_{timestamp}.txt'
        self.document_directory('.', root_doc_path, exclude_dirs=microservices_and_gateways)
        print(f"Documentación raíz creada: {root_doc_path}")

        # Documentar cada microservicio y gateway
        for ms_or_gateway in microservices_and_gateways:
            doc_path = f'{ms_or_gateway}_documentation_{timestamp}.txt'
            self.document_directory(ms_or_gateway, doc_path)
            print(f"Documentación del microservicio o gateway creada: {doc_path}")

    def document_directory(self, directory, output_file, exclude_dirs=None):
        if exclude_dirs is None:
            exclude_dirs = []

        with open(output_file, 'w', encoding='utf-8') as doc:
            doc.write(f"Documentación del Proyecto - {directory}\n")
            doc.write(f"Generado el: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            doc.write("=" * 80 + "\n\n")

            for root, dirs, files in os.walk(directory):
                # Filtrar directorios a ignorar
                dirs[:] = [d for d in dirs if d not in self.ignore_dirs and d not in exclude_dirs]

                # Procesar cada archivo
                for filename in sorted(files):
                    filepath = os.path.join(root, filename)

                    if self.should_include_file(filename, filepath):
                        try:
                            with open(filepath, 'r', encoding='utf-8') as file:
                                content = file.read()

                            doc.write(f"Archivo: {filepath}\n")
                            doc.write("-" * 80 + "\n")
                            doc.write(content)
                            doc.write("\n\n" + "=" * 80 + "\n\n")
                        except Exception as e:
                            doc.write(f"Error al leer {filepath}: {str(e)}\n")
                            doc.write("\n\n" + "=" * 80 + "\n\n")

if __name__ == "__main__":
    try:
        documenter = ProjectDocumenter()
        documenter.create_documentation()
        print("Documentación completada exitosamente.")
    except Exception as e:
        print(f"Error durante la generación de documentación: {str(e)}")